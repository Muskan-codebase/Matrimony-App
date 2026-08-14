import { Request, Response } from "express";
import { Profile } from "../profile.model";
import { Shortlist } from "../shortlist/shortlist.model";
import ProfileVisit from "../profile-visits/profileVisits.model";
import { Interest } from "../interest/interest.model";

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

        // Combine all notifications
        const notifications = [
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

            ...profileVisitors.map((visitor: any) => ({
                type: "profile_visited",
                message: "visited your profile",
                data: {
                    id: visitor.viewerProfileId?._id,
                    matrimonyId: visitor.viewerProfileId?.matrimonyId,
                    firstName:
                        visitor.viewerProfileId?.basicDetails?.firstName,
                    lastName:
                        visitor.viewerProfileId?.basicDetails?.lastName,
                },
                createdAt: visitor.createdAt,
            })),
        ];

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