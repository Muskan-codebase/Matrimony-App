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
import { Interest } from "../profile-details/interest/interest.model";
import { Block } from "../profile-details/block/block.model";
import { Shortlist } from "../profile-details/shortlist/shortlist.model";
import { PartnerPreference } from "../profile-details/partner-preference/partnerPreference.model"
import { Ignore } from "../profile-details/ignore/ignore.model";
import { Payment } from "../payment/payment.model";
import mongoose from "mongoose";

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
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const userId = new mongoose.Types.ObjectId(req.user.id);

        // --------------------------------------------------
        // 1. FIND USER AUTH
        // --------------------------------------------------

        const auth = await Auth.findById(userId).session(session);

        if (!auth) {
            await session.abortTransaction();

            res.status(404).json({
                success: false,
                message: "User not found.",
            });

            return;
        }

        // --------------------------------------------------
        // 2. FIND PROFILE
        // --------------------------------------------------

        const profile = await Profile.findOne({
            userId,
        }).session(session);

        const profileId = profile?._id;

        // --------------------------------------------------
        // 3. DELETE PARTNER PREFERENCE
        // --------------------------------------------------

        if (profileId) {
            await PartnerPreference.deleteMany(
                {
                    profileId,
                },
                { session }
            );
        }

        // --------------------------------------------------
        // 4. DELETE ACCOUNT SETTINGS
        // --------------------------------------------------

        await AccountSettings.deleteMany(
            {
                userId,
            },
            { session }
        );

        // --------------------------------------------------
        // DELETE PAYMENT RECORDS
        // --------------------------------------------------

        await Payment.deleteMany(
            {
                $or: [
                    { userId },
                    ...(profileId ? [{ profileId }] : []),
                ],
            },
            { session }
        );

        // --------------------------------------------------
        // 5. DELETE INTERESTS
        //
        // The user can appear either as sender or receiver.
        // --------------------------------------------------

        if (profileId) {
            await Interest.deleteMany(
                {
                    $or: [
                        { senderProfileId: profileId },
                        { receiverProfileId: profileId },
                    ],
                },
                { session }
            );
        }

        // --------------------------------------------------
        // 6. DELETE IGNORED PROFILES
        //
        // User can be the one ignoring OR the one being ignored.
        // --------------------------------------------------

        if (profileId) {
            await Ignore.deleteMany(
                {
                    $or: [
                        { profileId },
                        { ignoredProfileId: profileId },
                    ],
                },
                { session }
            );
        }

        // --------------------------------------------------
        // 7. DELETE BLOCKS
        //
        // User can be the blocker OR the blocked user.
        // --------------------------------------------------

        if (profileId) {
            await Block.deleteMany(
                {
                    $or: [
                        { profileId },
                        { blockedProfileId: profileId },
                    ],
                },
                { session }
            );
        }

        // --------------------------------------------------
        // 8. DELETE SHORTLISTS
        //
        // User can shortlist someone OR be shortlisted.
        // --------------------------------------------------

        if (profileId) {
            await Shortlist.deleteMany(
                {
                    $or: [
                        { profileId },
                        { shortlistedProfileId: profileId },
                    ],
                },
                { session }
            );
        }

        // --------------------------------------------------
        // 9. DELETE PROFILE
        // --------------------------------------------------

        if (profileId) {
            await Profile.deleteOne(
                {
                    _id: profileId,
                },
                { session }
            );
        }

        // --------------------------------------------------
        // 10. DELETE AUTH
        // --------------------------------------------------

        await Auth.deleteOne(
            {
                _id: userId,
            },
            { session }
        );

        // --------------------------------------------------
        // 11. COMMIT TRANSACTION
        // --------------------------------------------------

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "Profile and all associated data deleted permanently.",
        });

    } catch (error: any) {
        await session.abortTransaction();

        console.error("Delete Profile Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to permanently delete profile.",
        });

    } finally {
        await session.endSession();
    }
};