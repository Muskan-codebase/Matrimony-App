import { Schema, model } from "mongoose";
import { IMotherTongue } from "./motherTongue.interface";

const motherTongueSchema = new Schema<IMotherTongue>(
    {
        motherTongue: {
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

export const MotherTongue = model<IMotherTongue>(
    "MotherTongue",
    motherTongueSchema
);