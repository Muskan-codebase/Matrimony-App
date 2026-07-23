import { Document, Types } from "mongoose";

export interface IBlock extends Document {
    userId: Types.ObjectId;
    blockedUserId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}