import { Document, Types } from "mongoose";

export interface IAccountSettings extends Document {
    userId: Types.ObjectId;

    privacySettings: {
        mobileNoVisibility:
        | "Visible to all"
        | "Only to interest sent/accepted"
        | "Don't show to anyone";

        profileVisibility:
        | "Visible to all (default)"
        | "Incognito mode"
        | "Only to matches that fit my criteria";

        albumPrivacy:
        | "Visible to all (default)"
        | "Only to paid matches"
        | "Only to interest sent/accepted";

        lastSeenStatus:
        | "Visible to all (default)"
        | "Hide from all"
        | "Visible to accepted matches";
    };

    hideProfile: {
        isHidden: boolean;
        hiddenUntil?: Date;
        duration?: "7 days" | "15 days" | "30 days";
    };

    notificationSettings: {

        appNotifications: {

            dailyRecommendations: boolean;

            justJoined: boolean;

            pendingInterests: boolean;

            expiringInterests: boolean;

            profileVisitors: boolean;

            similarProfiles: boolean;

            filteredInterests: boolean;
        };

        smsNotifications: {

            membershipSMS: boolean;

            transactionalSMS: boolean;
        };

        emailNotifications: {

            matchAlertMails:
            | "Daily"
            | "3 times/week"
            | "Unsubscribe";

            visitorAlertMails:
            | "Daily"
            | "Days I do not login"
            | "Unsubscribe";

            membershipMails: boolean;

            newMatchesMails: boolean;

            contactAlertMails: boolean;

            photoRequestMails: boolean;

            kundliAlertMails: boolean;
        };
    };

    isDeleted: boolean;
}