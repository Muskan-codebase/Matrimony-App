import { Request, Response } from "express";
import { Ignore } from "./ignore.model";
import { Profile } from "../../profile-details/profile.model";
import { Shortlist } from "../shortlist/shortlist.model";
import ProfileVisit from "../profile-visits/profileVisits.model";
import {
    createIgnoreSchema,
    ignoreIdSchema,
} from "./ignore.validation";

export const addToIgnore = async (req: Request, res: Response) => {
    try {
        const { ignoredUserId } = createIgnoreSchema.parse(req.body);

        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        if (loggedInProfile._id.toString() === ignoredUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot ignore your own profile.",
            });
        }

        const ignoredProfile = await Profile.findById(
            ignoredUserId
        );

        if (!ignoredProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }

        const alreadyIgnored = await Ignore.findOne({
            userId: loggedInProfile._id,
            ignoredUserId,
        });

        if (alreadyIgnored) {
            return res.status(409).json({
                success: false,
                message: "Profile already ignored.",
            });
        }

        const ignore = await Ignore.create({
            userId: loggedInProfile._id,
            ignoredUserId,
        });

        // Remove from shortlist if it exists
        await Shortlist.findOneAndDelete({
            userId: loggedInProfile._id,
            shortlistedUserId: ignoredUserId,
        });

        await ProfileVisit.findOneAndDelete({
            userId: loggedInProfile._id,
            visitedProfileId: ignoredUserId,
        })

        return res.status(201).json({
            success: true,
            message: "Profile ignored successfully.",
            data: ignore,
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.issues[0].message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getMyIgnoredProfiles = async (req: Request, res: Response) => {
    try {
        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        const ignoredProfiles = await Ignore.find({
            userId: loggedInProfile._id,
        }).populate({
            path: "ignoredUserId",
            model: "Profile",
        });

        return res.status(200).json({
            success: true,
            data: ignoredProfiles,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getIgnoreById = async (req: Request, res: Response) => {
    try {
        const { id } = ignoreIdSchema.parse(req.params);

        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        const ignore = await Ignore.findOne({
            _id: id,
            userId: loggedInProfile._id,
        }).populate({
            path: "ignoredUserId",
            model: "Profile",
        });

        if (!ignore) {
            return res.status(404).json({
                success: false,
                message: "Ignored profile not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: ignore,
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.issues[0].message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const removeFromIgnore = async (req: Request, res: Response) => {
    try {
        const { id } = ignoreIdSchema.parse(req.params);

        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        const deletedIgnore = await Ignore.findOneAndDelete({
            _id: id,
            userId: loggedInProfile._id,
        });

        if (!deletedIgnore) {
            return res.status(404).json({
                success: false,
                message: "Ignored profile not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile removed from ignored list successfully.",
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.issues[0].message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};