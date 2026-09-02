import { Document } from "mongoose";

export interface IPrivacyPolicy {
    title: string;
    content: string;
}

export interface IPrivacyPolicyDocument extends IPrivacyPolicy, Document {
    createdAt: Date;
    updatedAt: Date;
}