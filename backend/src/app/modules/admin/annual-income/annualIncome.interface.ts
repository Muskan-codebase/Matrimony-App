import { Document } from "mongoose";

export interface IAnnualIncome extends Document {
    annualIncome: string;
    minIncome: number;
    maxIncome: number | null;
    isDeleted?: boolean;
}