"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmailNotificationSchema = exports.updateSmsNotificationSchema = exports.updateAppNotificationSchema = exports.hideProfileSchema = exports.updatePrivacySettingsSchema = void 0;
const zod_1 = require("zod");
exports.updatePrivacySettingsSchema = zod_1.z.object({
    mobileNoVisibility: zod_1.z.enum([
        "Visible to all",
        "Only to interest sent/accepted",
        "Don't show to anyone",
    ]),
    profileVisibility: zod_1.z.enum([
        "Visible to all (default)",
        "Incognito mode",
        "Only to matches that fit my criteria",
    ]),
    albumPrivacy: zod_1.z.enum([
        "Visible to all (default)",
        "Only to paid matches",
        "Only to interest sent/accepted",
    ]),
    lastSeenStatus: zod_1.z.enum([
        "Visible to all (default)",
        "Hide from all",
        "Visible to accepted matches",
    ]),
});
exports.hideProfileSchema = zod_1.z.object({
    duration: zod_1.z.enum([
        "7 days",
        "15 days",
        "30 days",
    ]),
});
exports.updateAppNotificationSchema = zod_1.z.object({
    dailyRecommendations: zod_1.z.boolean(),
    justJoined: zod_1.z.boolean(),
    pendingInterests: zod_1.z.boolean(),
    expiringInterests: zod_1.z.boolean(),
    profileVisitors: zod_1.z.boolean(),
    similarProfiles: zod_1.z.boolean(),
    filteredInterests: zod_1.z.boolean(),
});
exports.updateSmsNotificationSchema = zod_1.z.object({
    membershipSMS: zod_1.z.boolean(),
    transactionalSMS: zod_1.z.boolean(),
});
exports.updateEmailNotificationSchema = zod_1.z.object({
    matchAlertMails: zod_1.z.enum([
        "Daily",
        "3 times/week",
        "Unsubscribe",
    ]),
    visitorAlertMails: zod_1.z.enum([
        "Daily",
        "Days I do not login",
        "Unsubscribe",
    ]),
    membershipMails: zod_1.z.boolean(),
    newMatchesMails: zod_1.z.boolean(),
    contactAlertMails: zod_1.z.boolean(),
    photoRequestMails: zod_1.z.boolean(),
    kundliAlertMails: zod_1.z.boolean(),
});
