import { Document } from "mongoose";

export interface IOccupation extends Document {
    occupation: string;
    createdBy: string;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}