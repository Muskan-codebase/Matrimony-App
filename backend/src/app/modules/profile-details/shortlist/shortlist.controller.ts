import { Request, Response } from "express";
import { Shortlist } from "./shortlist.model";
import { Profile } from "../profile.model";
import {
    createShortlistSchema,
    shortlistIdSchema,
} from "./shortlist.validation";

export const addToShortlist = async (req: Request, res: Response) => {
    try {
        const { shortlistedUserId } = createShortlistSchema.parse(req.body);

        // Find logged-in user's profile
        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        // Prevent self-shortlisting
        if (loggedInProfile._id.toString() === shortlistedUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot shortlist your own profile.",
            });
        }

        // Check if shortlisted profile exists
        const profile = await Profile.findById(shortlistedUserId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }

        // Prevent duplicate shortlist
        const alreadyShortlisted = await Shortlist.findOne({
            userId: loggedInProfile._id,
            shortlistedUserId,
        });

        if (alreadyShortlisted) {
            return res.status(409).json({
                success: false,
                message: "Profile already shortlisted.",
            });
        }

        const shortlist = await Shortlist.create({
            userId: loggedInProfile._id,
            shortlistedUserId,
        })

        const populatedShortlist = await Shortlist.findById(shortlist._id)
            .populate({
                path: "shortlistedUserId",
                model: "Profile",
            });

        return res.status(201).json({
            success: true,
            message: "Profile shortlisted successfully.",
            data: populatedShortlist,
        });

    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getMyShortlistedProfiles = async (
    req: Request,
    res: Response
) => {
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

        const shortlistedProfiles = await Shortlist.find({
            userId: loggedInProfile._id,
        }).populate({
            path: "shortlistedUserId",
            model: "Profile",
        });

        return res.status(200).json({
            success: true,
            data: shortlistedProfiles,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getUsersWhoShortlistedMe = async (
    req: Request,
    res: Response
) => {
    try {
        // Find logged-in user's profile
        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        // Find everyone who shortlisted this profile
        const shortlistedBy = await Shortlist.find({
            shortlistedUserId: loggedInProfile._id,
        }).populate({
            path: "userId",
            model: "Profile",
        });

        return res.status(200).json({
            success: true,
            data: shortlistedBy,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getShortlistById = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = shortlistIdSchema.parse(req.params);

        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        const shortlist = await Shortlist.findOne({
            _id: id,
            userId: loggedInProfile._id,
        }).populate({
            path: "shortlistedUserId",
            model: "Profile",
        });

        if (!shortlist) {
            return res.status(404).json({
                success: false,
                message: "Shortlist not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: shortlist,
        });
    } catch (error: any) {
        console.log(error);

        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.issues[0].message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const removeFromShortlist = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = shortlistIdSchema.parse(req.params);

        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        const deleted = await Shortlist.findOneAndDelete({
            _id: id,
            userId: loggedInProfile._id,
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Shortlist not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile removed from shortlist successfully.",
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};