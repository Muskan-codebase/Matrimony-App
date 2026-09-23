import { Document } from "mongoose";

export interface IBanner extends Document {
    image: string;
    badge: string;
    title: string;
    description: string;

    displayOrder: number;

    isActive: boolean;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}