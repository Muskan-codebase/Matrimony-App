import { Request, Response } from "express";
import { Profile } from "../../profile-details/profile.model";
import { Interest } from "../../profile-details/interest/interest.model";
import { AccountSettings } from "../accountSettings.model";
import { sendNotification } from "../../../services/sendNotification.service";

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