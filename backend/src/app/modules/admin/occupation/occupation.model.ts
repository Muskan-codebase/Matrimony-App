import { Schema, model } from "mongoose";
import { IOccupation } from "./occupation.interface";

const occupationSchema = new Schema<IOccupation>(
    {
        occupation: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        createdBy: {
            type: String,
            required: true,
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

export const Occupation = model<IOccupation>(
    "Occupation",
    occupationSchema
);