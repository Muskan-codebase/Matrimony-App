import { Document, Types } from "mongoose";

export interface ISubCaste extends Document {

    religionId: Types.ObjectId;

    casteId: Types.ObjectId;

    subCaste: string;

    isDeleted: boolean;

    createdAt: Date;

    updatedAt: Date;

}