import { Schema, model } from "mongoose";
import { IFAQ } from "./faq.interface";

const faqSchema = new Schema<IFAQ>(
    {
        question: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        answer: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },

        displayOrder: {
            type: Number,
            default: 1,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const FAQ = model<IFAQ>("FAQ", faqSchema);