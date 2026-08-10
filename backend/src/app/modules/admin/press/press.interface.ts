import { Document } from "mongoose";

export interface IPress {
    publication: string;
    date: string;
    image: string;
    title: string;
    description: string;
    articleUrl: string;
}

export interface IPressDocument extends IPress, Document {
    createdAt: Date;
    updatedAt: Date;
}