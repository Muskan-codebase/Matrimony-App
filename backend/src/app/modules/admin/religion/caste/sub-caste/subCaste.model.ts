import { Schema, model } from "mongoose";
import { ISubCaste } from "./subCaste.interface";

const subCasteSchema = new Schema<ISubCaste>(
    {

        religionId: {
            type: Schema.Types.ObjectId,
            ref: "Religion",
            required: true,
        },

        casteId: {
            type: Schema.Types.ObjectId,
            ref: "Caste",
            required: true,
        },

        subCaste: {
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

// Prevent duplicate sub-caste under same caste

subCasteSchema.index(
    {
        casteId: 1,
        subCaste: 1,
    },
    {
        unique: true,
    }
);

export const SubCaste = model<ISubCaste>(
    "SubCaste",
    subCasteSchema
);