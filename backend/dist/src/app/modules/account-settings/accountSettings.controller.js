"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.updateEmailNotifications = exports.updateSmsNotifications = exports.updateAppNotifications = exports.unhideProfile = exports.hideProfile = exports.updatePrivacySettings = exports.getAccountSettings = void 0;
const accountSettings_model_1 = require("./accountSettings.model");
const profile_model_1 = require("../profile-details/profile.model");
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const accountSettings_validation_1 = require("./accountSettings.validation");
const interest_model_1 = require("../profile-details/interest/interest.model");
const block_model_1 = require("../profile-details/block/block.model");
const shortlist_model_1 = require("../profile-details/shortlist/shortlist.model");
const partnerPreference_model_1 = require("../profile-details/partner-preference/partnerPreference.model");
const ignore_model_1 = require("../profile-details/ignore/ignore.model");
const payment_model_1 = require("../payment/payment.model");
const mongoose_1 = __importDefault(require("mongoose"));
//find or create aka lazy intialization 
const getAccountSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let settings = yield accountSettings_model_1.AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (!settings) {
            settings = yield accountSettings_model_1.AccountSettings.create({
                userId: req.user.id,
            });
        }
        return res.status(200).json({
            success: true,
            data: settings,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getAccountSettings = getAccountSettings;
const updatePrivacySettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = accountSettings_validation_1.updatePrivacySettingsSchema.parse(req.body);
        const settings = yield accountSettings_model_1.AccountSettings.findOne({
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
        yield settings.save();
        res.status(200).json({
            success: true,
            message: "Privacy settings updated successfully.",
            data: settings,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updatePrivacySettings = updatePrivacySettings;
const hideProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = accountSettings_validation_1.hideProfileSchema.parse(req.body);
        const settings = yield accountSettings_model_1.AccountSettings.findOne({
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
        yield settings.save();
        res.status(200).json({
            success: true,
            message: `Profile hidden for ${validatedData.duration}.`,
            data: settings.hideProfile,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.hideProfile = hideProfile;
const unhideProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield accountSettings_model_1.AccountSettings.findOne({
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
        yield settings.save();
        res.status(200).json({
            success: true,
            message: "Profile is now visible.",
            data: settings,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.unhideProfile = unhideProfile;
const updateAppNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = accountSettings_validation_1.updateAppNotificationSchema.parse(req.body);
        const settings = yield accountSettings_model_1.AccountSettings.findOne({
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
        yield settings.save();
        res.status(200).json({
            success: true,
            message: "App notifications updated successfully.",
            data: settings.notificationSettings.appNotifications,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateAppNotifications = updateAppNotifications;
const updateSmsNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = accountSettings_validation_1.updateSmsNotificationSchema.parse(req.body);
        const settings = yield accountSettings_model_1.AccountSettings.findOne({
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
        yield settings.save();
        res.status(200).json({
            success: true,
            message: "SMS notifications updated successfully.",
            data: settings.notificationSettings.smsNotifications,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateSmsNotifications = updateSmsNotifications;
const updateEmailNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = accountSettings_validation_1.updateEmailNotificationSchema.parse(req.body);
        const settings = yield accountSettings_model_1.AccountSettings.findOne({
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
        yield settings.save();
        res.status(200).json({
            success: true,
            message: "Email notifications updated successfully.",
            data: settings.notificationSettings.emailNotifications,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateEmailNotifications = updateEmailNotifications;
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const userId = new mongoose_1.default.Types.ObjectId(req.user.id);
        // --------------------------------------------------
        // 1. FIND USER AUTH
        // --------------------------------------------------
        const auth = yield auth_model_1.default.findById(userId).session(session);
        if (!auth) {
            yield session.abortTransaction();
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }
        // --------------------------------------------------
        // 2. FIND PROFILE
        // --------------------------------------------------
        const profile = yield profile_model_1.Profile.findOne({
            userId,
        }).session(session);
        const profileId = profile === null || profile === void 0 ? void 0 : profile._id;
        // --------------------------------------------------
        // 3. DELETE PARTNER PREFERENCE
        // --------------------------------------------------
        if (profileId) {
            yield partnerPreference_model_1.PartnerPreference.deleteMany({
                profileId,
            }, { session });
        }
        // --------------------------------------------------
        // 4. DELETE ACCOUNT SETTINGS
        // --------------------------------------------------
        yield accountSettings_model_1.AccountSettings.deleteMany({
            userId,
        }, { session });
        // --------------------------------------------------
        // DELETE PAYMENT RECORDS
        // --------------------------------------------------
        yield payment_model_1.Payment.deleteMany({
            $or: [
                { userId },
                ...(profileId ? [{ profileId }] : []),
            ],
        }, { session });
        // --------------------------------------------------
        // 5. DELETE INTERESTS
        //
        // The user can appear either as sender or receiver.
        // --------------------------------------------------
        if (profileId) {
            yield interest_model_1.Interest.deleteMany({
                $or: [
                    { senderProfileId: profileId },
                    { receiverProfileId: profileId },
                ],
            }, { session });
        }
        // --------------------------------------------------
        // 6. DELETE IGNORED PROFILES
        //
        // User can be the one ignoring OR the one being ignored.
        // --------------------------------------------------
        if (profileId) {
            yield ignore_model_1.Ignore.deleteMany({
                $or: [
                    { profileId },
                    { ignoredProfileId: profileId },
                ],
            }, { session });
        }
        // --------------------------------------------------
        // 7. DELETE BLOCKS
        //
        // User can be the blocker OR the blocked user.
        // --------------------------------------------------
        if (profileId) {
            yield block_model_1.Block.deleteMany({
                $or: [
                    { profileId },
                    { blockedProfileId: profileId },
                ],
            }, { session });
        }
        // --------------------------------------------------
        // 8. DELETE SHORTLISTS
        //
        // User can shortlist someone OR be shortlisted.
        // --------------------------------------------------
        if (profileId) {
            yield shortlist_model_1.Shortlist.deleteMany({
                $or: [
                    { profileId },
                    { shortlistedProfileId: profileId },
                ],
            }, { session });
        }
        // --------------------------------------------------
        // 9. DELETE PROFILE
        // --------------------------------------------------
        if (profileId) {
            yield profile_model_1.Profile.deleteOne({
                _id: profileId,
            }, { session });
        }
        // --------------------------------------------------
        // 10. DELETE AUTH
        // --------------------------------------------------
        yield auth_model_1.default.deleteOne({
            _id: userId,
        }, { session });
        // --------------------------------------------------
        // 11. COMMIT TRANSACTION
        // --------------------------------------------------
        yield session.commitTransaction();
        res.status(200).json({
            success: true,
            message: "Profile and all associated data deleted permanently.",
        });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error("Delete Profile Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to permanently delete profile.",
        });
    }
    finally {
        yield session.endSession();
    }
});
exports.deleteProfile = deleteProfile;
