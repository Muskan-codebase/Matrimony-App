import mongoose, { Schema } from "mongoose";
import { IAccountSettings } from "./accountSettings.interface";

const accountSettingsSchema = new Schema<IAccountSettings>(
    {

        userId: {
            type: Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
            unique: true,
        },

        privacySettings: {

            mobileNoVisibility: {
                type: String,
                enum: [
                    "Visible to all",
                    "Only to interest sent/accepted",
                    "Don't show to anyone",
                ],
                default: "Visible to all",
            },

            profileVisibility: {
                type: String,
                enum: [
                    "Visible to all (default)",
                    "Incognito mode",
                    "Only to matches that fit my criteria",
                ],
                default: "Visible to all (default)",
            },

            albumPrivacy: {
                type: String,
                enum: [
                    "Visible to all (default)",
                    "Only to paid matches",
                    "Only to interest sent/accepted",
                ],
                default: "Visible to all (default)",
            },

            lastSeenStatus: {
                type: String,
                enum: [
                    "Visible to all (default)",
                    "Hide from all",
                    "Visible to accepted matches",
                ],
                default: "Visible to all (default)",
            },
        },

        hideProfile: {

            isHidden: {
                type: Boolean,
                default: false,
            },

            duration: {
                type: String,
                enum: [
                    "7 days",
                    "15 days",
                    "30 days",
                ],
            },

            hiddenUntil: Date,
        },

        notificationSettings: {

            appNotifications: {

                dailyRecommendations: Boolean,

                justJoined: Boolean,

                pendingInterests: Boolean,

                expiringInterests: Boolean,

                profileVisitors: Boolean,

                similarProfiles: Boolean,

                filteredInterests: Boolean,
            },

            smsNotifications: {

                membershipSMS: Boolean,

                transactionalSMS: Boolean,
            },

            emailNotifications: {

                matchAlertMails: {
                    type: String,
                    enum: [
                        "Daily",
                        "3 times/week",
                        "Unsubscribe",
                    ],
                    default: "Daily",
                },

                visitorAlertMails: {
                    type: String,
                    enum: [
                        "Daily",
                        "Days I do not login",
                        "Unsubscribe",
                    ],
                    default: "Daily",
                },

                membershipMails: Boolean,

                newMatchesMails: Boolean,

                contactAlertMails: Boolean,

                photoRequestMails: Boolean,

                kundliAlertMails: Boolean,
            },
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const AccountSettings = mongoose.model<IAccountSettings>(
    "AccountSettings",
    accountSettingsSchema
);