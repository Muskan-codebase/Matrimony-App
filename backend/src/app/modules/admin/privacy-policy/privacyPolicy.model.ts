import mongoose, { Schema } from "mongoose";
import { IPrivacyPolicyDocument } from "./privacyPolicy.interface";

const privacyPolicySchema = new Schema<IPrivacyPolicyDocument>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const PrivacyPolicy = mongoose.model<IPrivacyPolicyDocument>(
    "PrivacyPolicy",
    privacyPolicySchema
);