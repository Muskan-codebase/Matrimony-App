import { Schema, model } from "mongoose";
import { IReligion } from "./religion.interface";

const religionSchema = new Schema<IReligion>(
    {
        religion: {
            type: String,
            required: true,
            trim: true,
            unique: true,
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

export const Religion = model<IReligion>(
    "Religion",
    religionSchema
);