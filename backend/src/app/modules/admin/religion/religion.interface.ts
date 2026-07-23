import { Document } from "mongoose";

export interface IReligion extends Document {
    religion: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}