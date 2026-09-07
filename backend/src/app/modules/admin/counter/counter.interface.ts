import { Document } from "mongoose";

export interface ICounter extends Document {
    mobileVerifiedProfiles: string;
    customersServed: string;
    successfulMatchmakingYears: string;
    createdAt: Date;
    updatedAt: Date;
}