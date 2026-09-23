import { Document } from "mongoose";

export interface IQualification extends Document {

    qualification: string;

    educationType: string;

    occupation: string;

    // annualIncome: string;

    isDeleted: boolean;

}