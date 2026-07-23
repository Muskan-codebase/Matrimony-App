import { Schema, model } from "mongoose";
import { IQualification } from "./qualification.interface";

const qualificationSchema = new Schema<IQualification>(
    {

        qualification: {
            type: String,
            required: true,
            trim: true,
        },

        educationType: {
            type: String,
            required: true,
            trim: true,
        },

        occupation: {
            type: String,
            required: true,
            trim: true,
        },

        // annualIncome: {
        //     type: String,
        //     required: true,
        //     trim: true,
        // },

        isDeleted: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);

export const Qualification = model<IQualification>(
    "Qualification",
    qualificationSchema
);