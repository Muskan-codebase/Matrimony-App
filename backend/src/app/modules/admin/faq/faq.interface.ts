import { Document } from "mongoose";

export interface IFAQ extends Document {
    question: string;
    answer: string;
    displayOrder: number;
    isActive: boolean;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}