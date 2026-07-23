import mongoose, { Schema } from "mongoose";
import { IPackage } from "./package.interface";

const packageSchema = new Schema<IPackage>(
    {

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        duration: {
            type: Number,
            required: true,
        },

        durationType: {
            type: String,
            enum: ["DAY", "MONTH", "YEAR"],
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        originalPrice: Number,

        discountPercentage: Number,

        badge: String,

        features: [
            {
                type: String,
            },
        ],

        isDeleted: {
            type: Boolean,
            default: false,
        },
        
        displayOrder: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPackage>(
    "Package",
    packageSchema
);