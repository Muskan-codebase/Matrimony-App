import { Document, Types } from "mongoose";

export interface IHelpCentre extends Document {
    _id: Types.ObjectId;

    title: string;

    description?: string;

    icon?: string;

    displayOrder: number;

    isActive: boolean;

    isDeleted: boolean;

    createdAt: Date;

    updatedAt: Date;
}