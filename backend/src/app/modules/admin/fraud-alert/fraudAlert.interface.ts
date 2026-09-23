import { Document } from "mongoose";

export interface IFraudAlert extends Document {
    title: string;
    content: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}