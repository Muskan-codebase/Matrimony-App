import { z } from "zod";

export const updatePrivacySettingsSchema = z.object({

    mobileNoVisibility: z.enum([
        "Visible to all",
        "Only to interest sent/accepted",
        "Don't show to anyone",
    ]),

    profileVisibility: z.enum([
        "Visible to all (default)",
        "Incognito mode",
        "Only to matches that fit my criteria",
    ]),

    albumPrivacy: z.enum([
        "Visible to all (default)",
        "Only to paid matches",
        "Only to interest sent/accepted",
    ]),

    lastSeenStatus: z.enum([
        "Visible to all (default)",
        "Hide from all",
        "Visible to accepted matches",
    ]),
});

export const hideProfileSchema = z.object({

    duration: z.enum([
        "7 days",
        "15 days",
        "30 days",
    ]),
});

export const updateAppNotificationSchema = z.object({

    dailyRecommendations: z.boolean(),

    justJoined: z.boolean(),

    pendingInterests: z.boolean(),

    expiringInterests: z.boolean(),

    profileVisitors: z.boolean(),

    similarProfiles: z.boolean(),

    filteredInterests: z.boolean(),
});

export const updateSmsNotificationSchema = z.object({

    membershipSMS: z.boolean(),

    transactionalSMS: z.boolean(),
});

export const updateEmailNotificationSchema = z.object({

    matchAlertMails: z.enum([
        "Daily",
        "3 times/week",
        "Unsubscribe",
    ]),

    visitorAlertMails: z.enum([
        "Daily",
        "Days I do not login",
        "Unsubscribe",
    ]),

    membershipMails: z.boolean(),

    newMatchesMails: z.boolean(),

    contactAlertMails: z.boolean(),

    photoRequestMails: z.boolean(),

    kundliAlertMails: z.boolean(),
});