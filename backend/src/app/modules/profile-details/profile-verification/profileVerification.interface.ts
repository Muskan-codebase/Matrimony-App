import { Document, Types } from "mongoose";

export enum VerificationStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}

export interface IProfileVerification extends Document {
    profileId: Types.ObjectId;

    selfieUrl: string;
    adhaarFrontUrl: string;

    status: VerificationStatus;

    rejectionReason?: string | null;

    submittedAt: Date;

    reviewedBy?: Types.ObjectId | null;
    reviewedAt?: Date | null;

    createdAt: Date;
    updatedAt: Date;
}