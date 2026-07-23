import { Schema, model } from "mongoose";
import { IHeight } from "./height.interface";

const heightSchema = new Schema<IHeight>(
    {

        height: {
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

export const Height = model<IHeight>(
    "Height",
    heightSchema
);