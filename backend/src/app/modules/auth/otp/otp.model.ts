import mongoose, { Schema } from "mongoose";
import { IOtp } from "./otp.interface";

const otpSchema = new Schema<IOtp>(
    {

        authId: {
            type: Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },

        otp: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        attempts: {
            type: Number,
            default: 0,
        },

        resendCount: {
            type: Number,
            default: 0,
        },

        lastResendAt: {
            type: Date,
        },

        isUsed: {
            type: Boolean,
            default: false,
        }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model<IOtp>("Otp", otpSchema);