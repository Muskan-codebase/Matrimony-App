import { Schema, model } from "mongoose";
import { IHelpCentre } from "./helpCenter.interface";

const helpCentreSchema = new Schema<IHelpCentre>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        icon: {
            type: String,
            trim: true,
        },

        displayOrder: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
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

export const HelpCentre = model<IHelpCentre>(
    "HelpCentre",
    helpCentreSchema
);