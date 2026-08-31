import { Request, Response } from "express";
import { AccountSettings } from "./accountSettings.model";
import { Profile } from "../profile-details/profile.model";
import Auth from "../auth/auth.model";
import {
    updatePrivacySettingsSchema,
    hideProfileSchema,
    updateSmsNotificationSchema,
    updateAppNotificationSchema,
    updateEmailNotificationSchema
} from "./accountSettings.validation";

//find or create aka lazy intialization 
export const getAccountSettings = async (
    req: Request,
    res: Response
) => {

    try {

        let settings = await AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!settings) {

            settings = await AccountSettings.create({
                userId: req.user.id,
            });

        }

        return res.status(200).json({
            success: true,
            data: settings,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const updatePrivacySettings = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const validatedData =
            updatePrivacySettingsSchema.parse(req.body);

        const settings = await AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!settings) {
            res.status(404).json({
                success: false,
                message: "Account settings not found.",
            });
            return;
        }

        settings.privacySettings.mobileNoVisibility =
            validatedData.mobileNoVisibility;

        settings.privacySettings.profileVisibility =
            validatedData.profileVisibility;

        settings.privacySettings.albumPrivacy =
            validatedData.albumPrivacy;

        settings.privacySettings.lastSeenStatus =
            validatedData.lastSeenStatus;

        await settings.save();

        res.status(200).json({
            success: true,
            message: "Privacy settings updated successfully.",
            data: settings,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const hideProfile = async (req: Request, res: Response): Promise<void> => {

    try {

        const validatedData = hideProfileSchema.parse(req.body);

        const settings = await AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!settings) {
            res.status(404).json({
                success: false,
                message: "Account settings not found.",
            });
            return;
        }

        const hiddenUntil = new Date();

        switch (validatedData.duration) {

            case "7 days":
                hiddenUntil.setDate(hiddenUntil.getDate() + 7);
                break;

            case "15 days":
                hiddenUntil.setDate(hiddenUntil.getDate() + 15);
                break;

            case "30 days":
                hiddenUntil.setDate(hiddenUntil.getDate() + 30);
                break;
        }

        settings.hideProfile.isHidden = true;
        settings.hideProfile.duration = validatedData.duration;
        settings.hideProfile.hiddenUntil = hiddenUntil;

        await settings.save();

        res.status(200).json({
            success: true,
            message: `Profile hidden for ${validatedData.duration}.`,
            data: settings.hideProfile,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const unhideProfile = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const settings = await AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!settings) {
            res.status(404).json({
                success: false,
                message: "Account settings not found.",
            });
            return;
        }

        settings.hideProfile.isHidden = false;
        settings.hideProfile.hiddenUntil = undefined;

        await settings.save();

        res.status(200).json({
            success: true,
            message: "Profile is now visible.",
            data: settings,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const updateAppNotifications = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const validatedData =
            updateAppNotificationSchema.parse(req.body);

        const settings = await AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!settings) {
            res.status(404).json({
                success: false,
                message: "Account settings not found.",
            });
            return;
        }

        settings.notificationSettings.appNotifications = validatedData;

        await settings.save();

        res.status(200).json({
            success: true,
            message: "App notifications updated successfully.",
            data: settings.notificationSettings.appNotifications,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const updateSmsNotifications = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const validatedData =
            updateSmsNotificationSchema.parse(req.body);

        const settings = await AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!settings) {
            res.status(404).json({
                success: false,
                message: "Account settings not found.",
            });
            return;
        }

        settings.notificationSettings.smsNotifications = validatedData;

        await settings.save();

        res.status(200).json({
            success: true,
            message: "SMS notifications updated successfully.",
            data: settings.notificationSettings.smsNotifications,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const updateEmailNotifications = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const validatedData =
            updateEmailNotificationSchema.parse(req.body);

        const settings = await AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!settings) {
            res.status(404).json({
                success: false,
                message: "Account settings not found.",
            });
            return;
        }

        settings.notificationSettings.emailNotifications = validatedData;

        await settings.save();

        res.status(200).json({
            success: true,
            message: "Email notifications updated successfully.",
            data: settings.notificationSettings.emailNotifications,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const deleteProfile = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const auth = await Auth.findById(req.user.id);

        if (!auth) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }

        const profile = await Profile.findOne({
            userId: req.user.id,
        });

        const settings = await AccountSettings.findOne({
            userId: req.user.id,
        });

        auth.isDeleted = true;

        if (profile) {
            profile.isDeleted = true;
            await profile.save();
        }

        if (settings) {
            settings.isDeleted = true;
            await settings.save();
        }

        await auth.save();

        res.status(200).json({
            success: true,
            message: "Profile deleted successfully.",
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};