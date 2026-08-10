import { Document, Types } from "mongoose";
import { ReportReason } from "../../../enums/report-reason.enum";

export enum ReportStatus {
    PENDING = "pending",
    RESOLVED = "resolved",
    REJECTED = "rejected",
}

export enum AdminAction {
    NONE = "none",
    BLOCKED = "blocked",
    DISMISSED = "dismissed",
}

export interface IProfileReport extends Document {
    reporterId: Types.ObjectId;

    reportedProfileId: Types.ObjectId;

    reason: ReportReason;

    status: ReportStatus;

    adminAction: AdminAction;

    adminId?: Types.ObjectId | null;

    adminNote?: string | null;

    resolvedAt?: Date | null;

    isBlocked: boolean;

    blockedAt?: Date | null;

    blockedBy?: Types.ObjectId | null;

    blockReason?: string | null;

    createdAt: Date;
    updatedAt: Date;
}