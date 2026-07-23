import { Document } from "mongoose";

export interface IPackage extends Document {

    title: string;

    description: string;

    duration: number;

    durationType: "DAY" | "MONTH" | "YEAR";

    price: number;

    originalPrice?: number;

    discountPercentage?: number;

    badge?: string;

    features: string[];

    isDeleted: boolean;

    displayOrder: number;

    createdAt?: Date;

    updatedAt?: Date;
}