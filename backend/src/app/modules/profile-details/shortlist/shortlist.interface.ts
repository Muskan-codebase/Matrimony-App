import { Document, Types } from "mongoose";

export interface IShortlist extends Document {
    userId: Types.ObjectId;
    shortlistedUserId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}