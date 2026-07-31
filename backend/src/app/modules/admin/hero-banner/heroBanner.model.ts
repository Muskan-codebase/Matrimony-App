import { Schema, model } from "mongoose";
import { IBanner } from "./heroBanner.interface";

const bannerSchema = new Schema<IBanner>(
    {
        image: {
            type: String,
            required: true,
            trim: true,
        },

        badge: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        displayOrder: {
            type: Number,
            required: true,
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

export const Banner = model<IBanner>("Banner", bannerSchema);