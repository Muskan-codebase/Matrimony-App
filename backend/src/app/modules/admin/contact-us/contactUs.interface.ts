import { Document } from "mongoose";

export interface IContactUs {
    officeAddress: string;
    email: string;
}

export interface IContactUsDocument extends IContactUs, Document {
    createdAt: Date;
    updatedAt: Date;
}