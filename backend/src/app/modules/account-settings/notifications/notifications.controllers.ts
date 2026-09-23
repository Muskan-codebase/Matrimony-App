import { Request, Response } from "express";
import { Profile } from "../../profile-details/profile.model";
import { Interest } from "../../profile-details/interest/interest.model";
import { AccountSettings } from "../accountSettings.model";
import { sendNotification } from "../../../services/sendNotification.service";
import { PartnerPreference } from "../../profile-details/partner-preference/partnerPreference.model";

export const sendJustJoinedNotifications = async (
    req: Request,
    res: Response
) => {
    try {
        // Profiles joined in the last 24 hours
        const last24Hours = new Date(
            Date.now() - 24 * 60 * 60 * 1000
        );

        const justJoinedProfiles = await Profile.find({
            createdAt: {
                $gte: last24Hours,
            },
            isDeleted: false,
        }).select(
            "_id userId basicDetails.firstName basicDetails.lastName"
        );

        if (justJoinedProfiles.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No new profiles found.",
                count: 0,
            });
        }

        // Get users who have Just Joined notifications enabled
        const accountSettings = await AccountSettings.find({
            isDeleted: false,
            "notificationSettings.appNotifications.justJoined": true,
        }).select("userId");

        let notificationsSent = 0;

        // Send notification to each eligible user
        for (const settings of accountSettings) {
            const userId = settings.userId.toString();

            // Don't notify the user about their own profile
            const newProfilesForUser = justJoinedProfiles.filter(
                (profile) =>
                    profile.userId.toString() !== userId
            );

            if (newProfilesForUser.length === 0) {
                continue;
            }

            await sendNotification({
                receiverId: userId,
                title: "New Profiles Just Joined",
                body: `${newProfilesForUser.length} new profiles just joined SahaJeevan.`,
                data: {
                    type: "just_joined",
                    count: newProfilesForUser.length.toString(),
                },
            });

            notificationsSent++;
        }

        return res.status(200).json({
            success: true,
            message: "Just Joined notifications sent successfully.",
            newProfiles: justJoinedProfiles.length,
            notificationsSent,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const pendingInterestNotification = async (
    req: Request,
    res: Response
) => {
    try {
        // 1. Get users who enabled Pending Interest notifications
        const accountSettings = await AccountSettings.find({
            isDeleted: false,
            "notificationSettings.appNotifications.pendingInterests": true,
        })
            .select("userId")
            .lean();

        if (accountSettings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No users have pending interest notifications enabled.",
                notificationsSent: 0,
            });
        }

        const userIds = accountSettings.map(
            (settings) => settings.userId
        );

        // 2. Get all eligible profiles in ONE query
        const profiles = await Profile.find({
            userId: { $in: userIds },
            isDeleted: false,
        })
            .select("_id userId")
            .lean();

        if (profiles.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No eligible profiles found.",
                notificationsSent: 0,
            });
        }

        // Map profileId → userId
        const profileToUserMap = new Map(
            profiles.map((profile) => [
                profile._id.toString(),
                profile.userId.toString(),
            ])
        );

        const profileIds = profiles.map(
            (profile) => profile._id
        );

        // 3. Get ALL pending interests in ONE query
        const pendingInterests = await Interest.find({
            receiverId: { $in: profileIds },
            status: "Pending",
            isDeleted: false,
        })
            .select("receiverId")
            .lean();

        // Count pending interests by receiver profile
        const pendingCountMap = new Map<string, number>();

        for (const interest of pendingInterests) {
            const receiverId = interest.receiverId.toString();

            pendingCountMap.set(
                receiverId,
                (pendingCountMap.get(receiverId) || 0) + 1
            );
        }

        let notificationsSent = 0;

        // Send notifications
        for (const profile of profiles) {
            const profileId = profile._id.toString();

            const pendingCount =
                pendingCountMap.get(profileId) || 0;

            if (pendingCount === 0) {
                continue;
            }

            const userId = profileToUserMap.get(profileId);

            if (!userId) {
                continue;
            }

            await sendNotification({
                receiverId: userId,
                title: "Pending Interest Requests",
                body: `You have ${pendingCount} pending interest request${pendingCount > 1 ? "s" : ""
                    }.`,
                data: {
                    type: "pending_interests",
                    count: pendingCount.toString(),
                },
            });

            notificationsSent++;
        }

        return res.status(200).json({
            success: true,
            message: "Pending interest notifications sent successfully.",
            notificationsSent,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || "Internal Server Error",
        });
    }
};

export const sendSimilarProfilesNotifications = async (req: Request, res: Response) => {

    try {

        //Get users who enabled account settings similar profiles
        const accountSettings = await AccountSettings.find({
            isDeleted: false,
            "notificationSettings.appNotifications.similarProfiles": true,
        }).select("userId").lean();

        if (accountSettings.length === 0) {
            res.status(400).json({
                success: false,
                message: "No users have similar profile notifications enabled",
                notificationSent: 0
            })

            return;
        }

        const userIds = accountSettings.map((settings) => settings.userId);

        //Get profiles of those User Ids
        const userProfiles = await Profile.find({
            userId: { $in: userIds },
            isDeleted: false
        }).select("_id userId").lean();

        if (userProfiles.length === 0) {
            res.status(400).json({
                success: false,
                message: "No eligible profiles found"
            })

            return;
        }

        // Map profileId -> profile
        // This avoids .find() inside the loop.
        const profileMap = new Map(
            userProfiles.map((profile) => [
                profile._id.toString(),
                profile,
            ])
        );

        const profileIds = userProfiles.map(
            (profile) => profile._id
        );

        // =====================================================
        // 3. Get Partner Preferences
        // =====================================================

        const partnerPreferences =
            await PartnerPreference.find({
                profileId: { $in: profileIds },
                isDeleted: false,
            })
                .lean();

        if (partnerPreferences.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No partner preferences found.",
                notificationsSent: 0,
            });
        }

        // =====================================================
        // 4. Get ALL candidate profiles in ONE query
        // =====================================================

        const candidateProfiles = await Profile.find({
            isDeleted: false,
            isBlocked: false,
        })
            .select(
                "_id userId basicDetails educationDetails religionDetails locationDetails lifestyleDetails aboutMe"
            )
            .lean();

        if (candidateProfiles.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No candidate profiles found.",
                notificationsSent: 0,
            });
        }

        // =====================================================
        // 5. Match profiles in memory
        // =====================================================

        let notificationsSent = 0;
        let totalMatchingProfiles = 0;

        for (const preference of partnerPreferences) {
            const userProfile = profileMap.get(
                preference.profileId.toString()
            );

            if (!userProfile) {
                continue;
            }

            const userId = userProfile.userId.toString();

            const minAge =
                preference.basicDetails?.age?.minAge;

            const maxAge =
                preference.basicDetails?.age?.maxAge;

            const preferredCountries =
                preference.basicDetails?.partnerCountry || [];

            const preferredStates =
                preference.basicDetails?.partnerState || [];

            const preferredCities =
                preference.basicDetails?.partnerCity || [];

            const preferredMaritalStatuses =
                preference.basicDetails?.maritalStatus
                    ?.preferences || [];

            const preferredDietaryHabits =
                preference.lifestyleAndAppearance
                    ?.dietaryHabits?.preferences || [];

            const preferredSmokingHabits =
                preference.lifestyleAndAppearance
                    ?.smokingHabits?.preferences || [];

            const preferredDrinkingHabits =
                preference.lifestyleAndAppearance
                    ?.drinkingHabits?.preferences || [];

            const matchingProfiles = candidateProfiles.filter(
                (candidate) => {

                    // -----------------------------------------
                    // Don't match user's own profile
                    // -----------------------------------------

                    if (
                        candidate.userId.toString() === userId
                    ) {
                        return false;
                    }

                    // -----------------------------------------
                    // Age
                    // -----------------------------------------

                    const candidateAge =
                        candidate.basicDetails?.age;

                    if (
                        minAge !== undefined &&
                        candidateAge !== undefined &&
                        candidateAge < minAge
                    ) {
                        return false;
                    }

                    if (
                        maxAge !== undefined &&
                        candidateAge !== undefined &&
                        candidateAge > maxAge
                    ) {
                        return false;
                    }

                    // -----------------------------------------
                    // Country
                    // -----------------------------------------

                    if (
                        preferredCountries.length > 0 &&
                        !preferredCountries.includes(
                            candidate.locationDetails?.country || ""
                        )
                    ) {
                        return false;
                    }

                    // -----------------------------------------
                    // State
                    // -----------------------------------------

                    if (
                        preferredStates.length > 0 &&
                        !preferredStates.includes(
                            candidate.locationDetails?.state || ""
                        )
                    ) {
                        return false;
                    }

                    // -----------------------------------------
                    // City
                    // -----------------------------------------

                    if (
                        preferredCities.length > 0 &&
                        !preferredCities.includes(
                            candidate.locationDetails?.city || ""
                        )
                    ) {
                        return false;
                    }

                    // -----------------------------------------
                    // Marital Status
                    // -----------------------------------------

                    if (
                        preferredMaritalStatuses.length > 0
                    ) {
                        const candidateStatus =
                            candidate.basicDetails
                                ?.maritalStatus;

                        const statusMap: Record<
                            string,
                            string
                        > = {
                            "Divorced": "Divorce",
                            "Widowed": "Widow",
                        };

                        const normalizedStatus =
                            statusMap[candidateStatus || ""] ||
                            candidateStatus;

                        if (
                            !preferredMaritalStatuses.includes(
                                normalizedStatus as any
                            )
                        ) {
                            return false;
                        }
                    }

                    // -----------------------------------------
                    // Dietary Habit
                    // -----------------------------------------

                    if (
                        preferredDietaryHabits.length > 0 &&
                        !preferredDietaryHabits.includes(
                            "Doesn't Matter" as any
                        )
                    ) {
                        const candidateDiet =
                            candidate.lifestyleDetails
                                ?.eatingHabit;

                        if (
                            !preferredDietaryHabits.includes(
                                candidateDiet as any
                            )
                        ) {
                            return false;
                        }
                    }

                    // -----------------------------------------
                    // Smoking Habit
                    // -----------------------------------------

                    if (
                        preferredSmokingHabits.length > 0 &&
                        !preferredSmokingHabits.includes(
                            "Doesn't Matter" as any
                        )
                    ) {
                        const candidateSmoking =
                            candidate.lifestyle?.smokingHabit;

                        const smokingMap: Record<string, string> = {
                            Never: "No",
                            Occasionally: "Occasionally",
                            Regularly: "Yes",
                        };

                        const normalizedSmoking =
                            smokingMap[candidateSmoking || ""];

                        if (
                            !preferredSmokingHabits.includes(
                                normalizedSmoking as any
                            )
                        ) {
                            return false;
                        }
                    }


                    // -----------------------------------------
                    // Drinking Habit
                    // -----------------------------------------

                    if (
                        preferredDrinkingHabits.length > 0 &&
                        !preferredDrinkingHabits.includes(
                            "Doesn't Matter" as any
                        )
                    ) {
                        const candidateDrinking =
                            candidate.lifestyle?.drinkingHabit;

                        const drinkingMap: Record<string, string> = {
                            Never: "No",
                            Occasionally: "Occasionally",
                            Regularly: "Yes",
                        };

                        const normalizedDrinking =
                            drinkingMap[candidateDrinking || ""];

                        if (
                            !preferredDrinkingHabits.includes(
                                normalizedDrinking as any
                            )
                        ) {
                            return false;
                        }
                    }

                    // All preference conditions passed
                    return true;
                }
            );

            // =================================================
            // 6. No matching profiles
            // =================================================

            if (matchingProfiles.length === 0) {
                continue;
            }

            totalMatchingProfiles +=
                matchingProfiles.length;

            // =================================================
            // 7. Send notification
            // =================================================

            const count = matchingProfiles.length;

            await sendNotification({
                receiverId: userId,
                title: "Similar Profiles Found",
                body:
                    count === 1
                        ? "1 profile matching your preferences is available."
                        : `${count} profiles matching your preferences are available.`,
                data: {
                    type: "similar_profiles",
                    count: count.toString(),
                },
            });

            notificationsSent++;
        }

        // =====================================================
        // 8. Response
        // =====================================================

        return res.status(200).json({
            success: true,
            message:
                "Similar profile notifications sent successfully.",
            notificationsSent,
            totalMatchingProfiles,
        });



    } catch (error: any) {
        console.error(
            "Similar profile notification error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message || "Internal Server Error",
        });

    }
}