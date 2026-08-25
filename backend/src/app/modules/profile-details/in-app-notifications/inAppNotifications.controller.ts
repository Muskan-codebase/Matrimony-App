import { Request, Response } from "express";
import { Profile } from "../profile.model";
import { Shortlist } from "../shortlist/shortlist.model";
import ProfileVisit from "../profile-visits/profileVisits.model";
import { Interest } from "../interest/interest.model";
import { AccountSettings } from "../../account-settings/accountSettings.model";
import { getRecommended } from "../../../services/recommendation.service";
import { PartnerPreference } from "../partner-preference/partnerPreference.model";

export const getMyNotifications = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Find logged-in user's profile
        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!loggedInProfile) {
            res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
            return;
        }

        // Get account settings
        const accountSettings = await AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        const profileFields = "photo matrimonyId basicDetails.firstName basicDetails.lastName";

        // 1. Interests received by logged-in user
        const receivedInterests = await Interest.find({
            receiverId: loggedInProfile._id,
            isDeleted: false,
        })
            .populate({
                path: "senderId",
                model: "Profile",
                select: profileFields,
            })
            .sort({ createdAt: -1 })
            .lean();

        // 2. Users who shortlisted logged-in user
        const shortlistedBy = await Shortlist.find({
            shortlistedUserId: loggedInProfile._id,
        })
            .populate({
                path: "userId",
                model: "Profile",
                select: profileFields,
            })
            .sort({ createdAt: -1 })
            .lean();

        // 3. Users who visited logged-in user's profile
        const profileVisitors = await ProfileVisit.find({
            visitedProfileId: loggedInProfile._id,
        })
            .populate({
                path: "viewerProfileId",
                model: "Profile",
                select: profileFields,
            })
            .sort({ createdAt: -1 })
            .lean();

        // 4. Recommended profiles
        const recommendedProfiles = await getRecommended(
            loggedInProfile._id.toString()
        );

        // 5. Just Joined profiles - last 24 hours
        const last24Hours = new Date(
            Date.now() - 24 * 60 * 60 * 1000
        );

        const justJoinedProfiles = await Profile.find({
            createdAt: {
                $gte: last24Hours,
            },
            isDeleted: false,
            _id: {
                $ne: loggedInProfile._id,
            },
        })
            .select(
                "_id userId matrimonyId basicDetails.firstName basicDetails.lastName photo"
            )
            .lean();

        // 6. Pending interests
        const pendingInterests = await Interest.find({
            receiverId: loggedInProfile._id,
            status: "Pending",
            isDeleted: false,
        })
            .select("_id")
            .lean();

        // =====================================================
        // 7. Similar Profiles
        // =====================================================

        const partnerPreference = await PartnerPreference.findOne({
            profileId: loggedInProfile._id,
            isDeleted: false,
        }).lean();

        let similarProfilesCount = 0;

        if (partnerPreference) {
            const minAge =
                partnerPreference.basicDetails?.age?.minAge;

            const maxAge =
                partnerPreference.basicDetails?.age?.maxAge;

            const preferredCountries =
                partnerPreference.basicDetails?.partnerCountry || [];

            const preferredStates =
                partnerPreference.basicDetails?.partnerState || [];

            const preferredCities =
                partnerPreference.basicDetails?.partnerCity || [];

            const preferredMaritalStatuses =
                partnerPreference.basicDetails?.maritalStatus
                    ?.preferences || [];

            const preferredDietaryHabits =
                partnerPreference.lifestyleAndAppearance
                    ?.dietaryHabits?.preferences || [];

            const preferredSmokingHabits =
                partnerPreference.lifestyleAndAppearance
                    ?.smokingHabits?.preferences || [];

            const preferredDrinkingHabits =
                partnerPreference.lifestyleAndAppearance
                    ?.drinkingHabits?.preferences || [];

            const candidateProfiles = await Profile.find({
                isDeleted: false,
                isBlocked: false,
                _id: {
                    $ne: loggedInProfile._id,
                },
            })
                .select(
                    "userId basicDetails locationDetails lifestyleDetails lifestyle"
                )
                .lean();

            const matchingProfiles = candidateProfiles.filter(
                (candidate) => {
                    // Age
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

                    // Country
                    if (
                        preferredCountries.length > 0 &&
                        !preferredCountries.includes(
                            candidate.locationDetails?.country || ""
                        )
                    ) {
                        return false;
                    }

                    // State
                    if (
                        preferredStates.length > 0 &&
                        !preferredStates.includes(
                            candidate.locationDetails?.state || ""
                        )
                    ) {
                        return false;
                    }

                    // City
                    if (
                        preferredCities.length > 0 &&
                        !preferredCities.includes(
                            candidate.locationDetails?.city || ""
                        )
                    ) {
                        return false;
                    }

                    // Marital Status
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
                            Divorced: "Divorce",
                            Widowed: "Widow",
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

                    // Dietary Habit
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

                    // Smoking Habit
                    if (
                        preferredSmokingHabits.length > 0 &&
                        !preferredSmokingHabits.includes(
                            "Doesn't Matter" as any
                        )
                    ) {
                        const candidateSmoking =
                            candidate.lifestyle?.smokingHabit;

                        const smokingMap: Record<
                            string,
                            string
                        > = {
                            Never: "No",
                            Occasionally: "Occasionally",
                            Regularly: "Yes",
                        };

                        const normalizedSmoking =
                            smokingMap[
                            candidateSmoking || ""
                            ];

                        if (
                            !preferredSmokingHabits.includes(
                                normalizedSmoking as any
                            )
                        ) {
                            return false;
                        }
                    }

                    // Drinking Habit
                    if (
                        preferredDrinkingHabits.length > 0 &&
                        !preferredDrinkingHabits.includes(
                            "Doesn't Matter" as any
                        )
                    ) {
                        const candidateDrinking =
                            candidate.lifestyle?.drinkingHabit;

                        const drinkingMap: Record<
                            string,
                            string
                        > = {
                            Never: "No",
                            Occasionally: "Occasionally",
                            Regularly: "Yes",
                        };

                        const normalizedDrinking =
                            drinkingMap[
                            candidateDrinking || ""
                            ];

                        if (
                            !preferredDrinkingHabits.includes(
                                normalizedDrinking as any
                            )
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );

            similarProfilesCount =
                matchingProfiles.length;
        }

        // Combine all notifications
        const notifications: any[] = [
            ...receivedInterests.map((interest: any) => ({
                type: "interest_received",
                message: "sent you an interest request",
                data: {
                    id: interest.senderId?._id,
                    matrimonyId: interest.senderId?.matrimonyId,
                    firstName: interest.senderId?.basicDetails?.firstName,
                    lastName: interest.senderId?.basicDetails?.lastName,
                },
                createdAt: interest.createdAt,
            })),

            ...shortlistedBy.map((shortlist: any) => ({
                type: "profile_shortlisted",
                message: "shortlisted your profile",
                data: {
                    id: shortlist.userId?._id,
                    matrimonyId: shortlist.userId?.matrimonyId,
                    firstName: shortlist.userId?.basicDetails?.firstName,
                    lastName: shortlist.userId?.basicDetails?.lastName,
                },
                createdAt: shortlist.createdAt,
            })),

            // ...profileVisitors.map((visitor: any) => ({
            //     type: "profile_visited",
            //     message: "visited your profile",
            //     data: {
            //         id: visitor.viewerProfileId?._id,
            //         matrimonyId: visitor.viewerProfileId?.matrimonyId,
            //         firstName:
            //             visitor.viewerProfileId?.basicDetails?.firstName,
            //         lastName:
            //             visitor.viewerProfileId?.basicDetails?.lastName,
            //     },
            //     createdAt: visitor.createdAt,
            // })),
        ];

        // Profile Visitors
        // Show in-app notifications only when push notifications are disabled
        if (
            profileVisitors.length > 0 &&
            accountSettings?.notificationSettings?.appNotifications
                ?.profileVisitors === false
        ) {
            notifications.push(
                ...profileVisitors.map((visitor: any) => ({
                    type: "profile_visited",
                    message: "visited your profile",
                    data: {
                        id: visitor.viewerProfileId?._id,
                        matrimonyId:
                            visitor.viewerProfileId?.matrimonyId,
                        firstName:
                            visitor.viewerProfileId?.basicDetails?.firstName,
                        lastName:
                            visitor.viewerProfileId?.basicDetails?.lastName,
                    },
                    createdAt: visitor.createdAt,
                }))
            );
        }

        // Add recommendation as in-app notification
        // only when push notifications are disabled
        if (
            recommendedProfiles.length > 0 &&
            accountSettings?.notificationSettings?.appNotifications
                ?.dailyRecommendations === false
        ) {
            notifications.push({
                type: "recommended_profiles",
                message: "found recommended profiles for you",
                data: {
                    count: recommendedProfiles.length,
                },
                createdAt: new Date(),
            });
        }

        // Just Joined in-app notification
        // Only when push notifications are disabled
        if (
            justJoinedProfiles.length > 0 &&
            accountSettings?.notificationSettings?.appNotifications
                ?.justJoined === false
        ) {
            notifications.push({
                type: "just_joined",
                message: "new profiles just joined SahaJeevan",
                data: {
                    count: justJoinedProfiles.length,
                },
                createdAt: new Date(),
            });
        }

        // Pending Interests
        // Show in-app notification only when Firebase push is disabled
        if (
            pendingInterests.length > 0 &&
            accountSettings?.notificationSettings?.appNotifications
                ?.pendingInterests === false
        ) {
            notifications.push({
                type: "pending_interests",
                message: "you have pending interest requests",
                data: {
                    count: pendingInterests.length,
                },
                createdAt: new Date(),
            });
        }

        // =====================================================
        // Similar Profiles - In-App Notification
        // =====================================================
        if (
            similarProfilesCount > 0 &&
            accountSettings?.notificationSettings
                ?.appNotifications?.similarProfiles === false
        ) {
            notifications.push({
                type: "similar_profiles",
                message:
                    "found profiles matching your preferences",
                data: {
                    count: similarProfilesCount,
                },
                createdAt: new Date(),
            });
        }

        // Sort all notification types by latest activity
        notifications.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};