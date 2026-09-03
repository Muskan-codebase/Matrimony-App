import mongoose, { Schema } from "mongoose";
import { IFraudAlert } from "./fraudAlert.interface";

const fraudAlertSchema = new Schema<IFraudAlert>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const FraudAlert = mongoose.model<IFraudAlert>(
    "FraudAlert",
    fraudAlertSchema
);