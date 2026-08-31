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
    try {
        const auth = yield auth_model_1.default.findById(req.user.id);
        if (!auth) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }
        const profile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        const settings = yield accountSettings_model_1.AccountSettings.findOne({
            userId: req.user.id,
        });
        auth.isDeleted = true;
        if (profile) {
            profile.isDeleted = true;
            yield profile.save();
        }
        if (settings) {
            settings.isDeleted = true;
            yield settings.save();
        }
        yield auth.save();
        res.status(200).json({
            success: true,
            message: "Profile deleted successfully.",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteProfile = deleteProfile;
