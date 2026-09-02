import mongoose, { Schema } from "mongoose";
import { ITermsConditions } from "./termsConditions.interface";

const termsConditionsSchema = new Schema<ITermsConditions>(
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

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const TermsConditions = mongoose.model<ITermsConditions>(
    "TermsConditions",
    termsConditionsSchema
);