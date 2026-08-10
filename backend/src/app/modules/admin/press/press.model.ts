import mongoose, { Schema } from "mongoose";
import { IPressDocument } from "./press.interface";

const pressSchema = new Schema<IPressDocument>(
    {
        publication: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            required: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        articleUrl: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Press = mongoose.model<IPressDocument>(
    "Press",
    pressSchema
);