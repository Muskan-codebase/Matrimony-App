import { Types } from "mongoose";

export interface ITermsConditions {
    _id?: Types.ObjectId;
    title: string;
    content: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}