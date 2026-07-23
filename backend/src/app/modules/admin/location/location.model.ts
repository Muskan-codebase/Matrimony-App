import { Schema, model } from "mongoose";
import { ILocation } from "./location.interface";

const locationSchema = new Schema<ILocation>(
    {

        country: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        city: {
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

export const Location = model<ILocation>(
    "Location",
    locationSchema
);