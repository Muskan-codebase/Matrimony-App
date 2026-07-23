"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSettings = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const accountSettingsSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.AccountSettings = mongoose_1.default.model("AccountSettings", accountSettingsSchema);
