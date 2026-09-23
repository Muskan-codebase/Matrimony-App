import { Document, Types } from "mongoose";

export interface IIgnore extends Document {
    userId: Types.ObjectId;
    ignoredUserId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}