import { Request, Response } from "express";
import ProfileVisit from "./profileVisits.model";
import { Profile } from "../profile.model";
import { createProfileVisitSchema } from "./profileVisits.validation";
import { sendNotification } from "../../../services/sendNotification.service";

export const createProfileVisit = async (req: Request, res: Response) => {

    try {
        const validatedData = createProfileVisitSchema.parse(req.body);

        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            res.status(404).json({
                success: false,
                message: "Profile not found",
            });
            return;
        }

        if (
            loggedInProfile._id.toString() ===
            validatedData.visitedProfileId
        ) {
            res.status(400).json({
                success: false,
                message: "You cannot visit your own profile.",
            });
            return;
        }

        const profileExists = await Profile.findById(
            validatedData.visitedProfileId
        );

        if (!profileExists) {
            res.status(404).json({
                success: false,
                message: "Visited profile not found.",
            });
            return;
        }

        // Check if the profile has already been visited
        const existingVisit = await ProfileVisit.findOne({
            viewerProfileId: loggedInProfile._id,
            visitedProfileId: validatedData.visitedProfileId,
        });

        if (existingVisit) {

            // Update the visit time instead of creating a duplicate
            existingVisit.updatedAt = new Date();

            // If you don't have timestamps enabled, use:
            // existingVisit.visitedAt = new Date();

            await existingVisit.save();

            return res.status(200).json({
                success: true,
                message: "Profile visit updated successfully.",
            });
        }

        // First time visiting this profile
        await ProfileVisit.create({
            viewerProfileId: loggedInProfile._id,
            visitedProfileId: validatedData.visitedProfileId,
        });

        const receiverProfile = await Profile.findById(validatedData.visitedProfileId);

        if (!receiverProfile) {
            return res.status(404).json({
                success: false,
                message: "Receiver profile not found.",
            });
        }

        // Send notification
        await sendNotification({
            receiverId: receiverProfile.userId.toString(),
            title: "New Profile Visit",
            body: `${loggedInProfile.basicDetails.firstName} viewed your profile.`,
            data: {
                type: "profile_visit",
                visitorProfileId: loggedInProfile._id.toString(),
            },
        });

        return res.status(201).json({
            success: true,
            message: "Profile visit recorded successfully.",
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyVisitedProfiles = async (req: Request, res: Response): Promise<void> => {

    try {
        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            res.status(404).json({
                success: false,
                message: "Profile not found",
            });
            return;
        }

        const visits = await ProfileVisit.find({
            viewerProfileId: loggedInProfile._id,
        })
            .populate({
                path: "visitedProfileId",
                model: "Profile",
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: visits,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getProfileVisitors = async (req: Request, res: Response): Promise<void> => {
    try {
        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            res.status(404).json({
                success: false,
                message: "Profile not found",
            });
            return;
        }

        const visitors = await ProfileVisit.find({
            visitedProfileId: loggedInProfile._id,
        })
            .populate({
                path: "viewerProfileId",
                model: "Profile",
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: visitors,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteProfileVisit = async (req: Request, res: Response): Promise<void> => {
    try {
        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            res.status(404).json({
                success: false,
                message: "Profile not found",
            });
            return;
        }

        const visit = await ProfileVisit.findOneAndDelete({
            _id: req.params.id,
            viewerProfileId: loggedInProfile._id,
        });

        if (!visit) {
            res.status(404).json({
                success: false,
                message: "Profile visit not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Profile visit deleted successfully.",
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};