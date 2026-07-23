import { Schema, model } from "mongoose";
import { IAnnualIncome } from "./annualIncome.interface";

const annualIncomeSchema = new Schema<IAnnualIncome>(
    {
        annualIncome: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        minIncome: {
            type: Number,
            required: true,
            min: 0,
        },

        maxIncome: {
            type: Number,
            default: null,
            validate: {
                validator: function (this: IAnnualIncome, value: number | null) {
                    return value === null || value >= this.minIncome;
                },
                message: "maxIncome must be greater than or equal to minIncome.",
            },
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const AnnualIncome = model<IAnnualIncome>(
    "AnnualIncome",
    annualIncomeSchema
);