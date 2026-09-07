import { Document, Types } from "mongoose";

export interface IFAQ extends Document {
    helpCenterId: Types.ObjectId;
    question: string;
    answer: string;
    displayOrder: number;
    isActive: boolean;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}