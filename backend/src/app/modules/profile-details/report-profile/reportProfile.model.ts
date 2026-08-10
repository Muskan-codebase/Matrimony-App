import mongoose, { Schema } from "mongoose";
import {
    AdminAction,
    IProfileReport,
    ReportStatus,
} from "../report-profile/reportProfile.interface";
import { ReportReason } from "../../../enums/report-reason.enum";

const profileReportSchema = new Schema<IProfileReport>(
    {
        reporterId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },

        reportedProfileId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },

        reason: {
            type: String,
            enum: Object.values(ReportReason),
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(ReportStatus),
            default: ReportStatus.PENDING,
        },

        adminAction: {
            type: String,
            enum: Object.values(AdminAction),
            default: AdminAction.NONE,
        },

        adminId: {
            type: Schema.Types.ObjectId,
            ref: "Auth",
            default: null,
        },

        adminNote: {
            type: String,
            default: null,
            trim: true,
        },

        resolvedAt: {
            type: Date,
            default: null,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },

        // blockedAt: {
        //     type: Date,
        //     default: null,
        // },

        // blockedBy: {
        //     type: Schema.Types.ObjectId,
        //     ref: "Admin",
        //     default: null,
        // },

        // blockReason: {
        //     type: String,
        //     default: null,
        // },
    },
    {
        timestamps: true,
    }
);

profileReportSchema.index({
    reportedProfileId: 1,
    status: 1,
});

profileReportSchema.index({
    reporterId: 1,
    reportedProfileId: 1,
});

profileReportSchema.index({
    status: 1,
    createdAt: -1,
});

export const ProfileReport = mongoose.model<IProfileReport>(
    "ProfileReport",
    profileReportSchema
);