import { Schema, model } from "mongoose";
import { ICounter } from "./counter.interface";

const counterSchema = new Schema<ICounter>(
    {
        mobileVerifiedProfiles: {
            type: String,
            required: true,
            trim: true,
        },

        customersServed: {
            type: String,
            required: true,
            trim: true,
        },

        successfulMatchmakingYears: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Counter = model<ICounter>("Counter", counterSchema);