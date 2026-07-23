import { Document, Types } from "mongoose";

export interface ICaste extends Document {

    religionId: Types.ObjectId;

    caste: string;

    isDeleted: boolean;

    createdAt: Date;

    updatedAt: Date;

}