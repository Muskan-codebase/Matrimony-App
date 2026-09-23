import { Request, Response } from "express";
import { Block } from "./block.model";
import { Profile } from "../profile.model";
import {
    createBlockSchema,
    blockIdSchema,
} from "./block.validation";

export const blockProfile = async (
    req: Request,
    res: Response
) => {
    try {
        const { blockedUserId } = createBlockSchema.parse(req.body);

        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        if (loggedInProfile._id.toString() === blockedUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot block your own profile.",
            });
        }

        const blockedProfile = await Profile.findById(blockedUserId);

        if (!blockedProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }

        const alreadyBlocked = await Block.findOne({
            userId: loggedInProfile._id,
            blockedUserId,
        });

        if (alreadyBlocked) {
            return res.status(409).json({
                success: false,
                message: "Profile already blocked.",
            });
        }

        const block = await Block.create({
            userId: loggedInProfile._id,
            blockedUserId,
        });

        return res.status(201).json({
            success: true,
            message: "Profile blocked successfully.",
            data: block,
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

export const getMyBlockedProfiles = async (
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

        const blockedProfiles = await Block.find({
            userId: loggedInProfile._id,
        }).populate({
            path: "blockedUserId",
            model: "Profile",
        });

        return res.status(200).json({
            success: true,
            data: blockedProfiles,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getBlockedProfileById = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = blockIdSchema.parse(req.params);

        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        const block = await Block.findOne({
            _id: id,
            userId: loggedInProfile._id,
        }).populate({
            path: "blockedUserId",
            model: "Profile",
        });

        if (!block) {
            return res.status(404).json({
                success: false,
                message: "Blocked profile not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: block,
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

export const unblockProfile = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = blockIdSchema.parse(req.params);

        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        const deletedBlock = await Block.findOneAndDelete({
            _id: id,
            userId: loggedInProfile._id,
        });

        if (!deletedBlock) {
            return res.status(404).json({
                success: false,
                message: "Blocked profile not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile unblocked successfully.",
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