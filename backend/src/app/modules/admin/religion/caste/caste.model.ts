import { Schema, model } from "mongoose";
import { ICaste } from "./caste.interface";

const casteSchema = new Schema<ICaste>(
    {
        religionId: {
            type: Schema.Types.ObjectId,
            ref: "Religion",
            required: true,
        },

        caste: {
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

// Prevent duplicate caste within same religion
casteSchema.index(
    {
        religionId: 1,
        caste: 1,
    },
    {
        unique: true,
    }
);

export const Caste = model<ICaste>(
    "Caste",
    casteSchema
);