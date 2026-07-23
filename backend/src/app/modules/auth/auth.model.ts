import mongoose, { Schema } from "mongoose";
import { IUserAuth, AuthProvider, UserRole } from "./auth.interface";

const authSchema = new Schema<IUserAuth>(
    {

        mobile: {
            type: String,
            // required: true,
            unique: true,
            trim: true,
            index: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true,
            index: true,
        },

        password: {
            type: String,
        },

        countryCode: {
            type: String,
            default: "+91",
        },

        provider: {
            type: String,
            enum: Object.values(AuthProvider),
            default: AuthProvider.OTP,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        loginCount: {
            type: Number,
            default: 0,
        },

        lastLogin: {
            type: Date,
        },

        refreshToken: {
            type: String,
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model<IUserAuth>("Auth", authSchema);