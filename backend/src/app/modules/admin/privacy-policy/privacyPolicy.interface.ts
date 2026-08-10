import { Document } from "mongoose";

export interface IPrivacyPolicy {
    content: string;
}

export interface IPrivacyPolicyDocument extends IPrivacyPolicy, Document {
    createdAt: Date;
    updatedAt: Date;
}