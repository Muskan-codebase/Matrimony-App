import { model, Schema } from "mongoose";
import {
    IProfileVerification,
    VerificationStatus,
} from "./profileVerification.interface";

const profileVerificationSchema = new Schema<IProfileVerification>(
    {
        profileId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
            unique: true,
            index: true,
        },

        selfieUrl: {
            type: String,
            required: true,
            trim: true,
        },

        adhaarFrontUrl: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(VerificationStatus),
            default: VerificationStatus.PENDING,
            required: true,
            index: true,
        },

        rejectionReason: {
            type: String,
            trim: true,
            default: null,
        },

        submittedAt: {
            type: Date,
            default: Date.now,
            required: true,
        },

        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "Auth",
            default: null,
        },

        reviewedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const ProfileVerification = model<IProfileVerification>(
    "ProfileVerification",
    profileVerificationSchema
);