import { Document, Types } from "mongoose";

export interface IOtp extends Document {

    _id: Types.ObjectId;

    authId: Types.ObjectId;

    otp: string;

    expiresAt: Date;

    attempts: number;

    resendCount: number;

    lastResendAt: Date;

    isUsed: boolean;

    createdAt: Date;

    updatedAt: Date;
}