import { Document, Types } from "mongoose";

export enum AuthProvider {
    OTP = "OTP",
}

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

export interface IUserAuth extends Document {

    _id: Types.ObjectId;

    mobile: string;

    email?: string;

    password?: string;

    countryCode: string;

    provider: AuthProvider;

    isVerified: boolean;

    loginCount: number;

    lastLogin?: Date;

    refreshToken?: string;

    role: UserRole;

    isDeleted: boolean;

    createdAt: Date;

    updatedAt: Date;
}