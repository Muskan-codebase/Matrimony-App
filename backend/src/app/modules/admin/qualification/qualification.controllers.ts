import { Request, Response } from "express";
import { Qualification } from "./qualification.model";
import {
    createQualificationSchema,
    updateQualificationSchema,
} from "./qualification.validation";

// CREATE QUALIFICATION

export const createQualification = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = createQualificationSchema.parse({
            body: req.body,
        });

        const existingQualification = await Qualification.findOne({

            qualification: validatedData.body.qualification,

            educationType: validatedData.body.educationType,

            occupation: validatedData.body.occupation,

            // annualIncome: validatedData.body.annualIncome,

            isDeleted: false,

        });

        if (existingQualification) {

            return res.status(409).json({
                success: false,
                message: "Qualification already exists.",
            });

        }

        const qualification = await Qualification.create(
            validatedData.body
        );

        return res.status(201).json({
            success: true,
            message: "Qualification created successfully.",
            data: qualification,
        });

    }

    catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

// GET ALL QUALIFICATIONS

export const getQualifications = async (
    req: Request,
    res: Response
) => {

    try {

        const qualifications = await Qualification.find({
            isDeleted: false,
        });

        return res.status(200).json({

            success: true,

            count: qualifications.length,

            data: qualifications,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// GET QUALIFICATION BY ID

export const getQualificationById = async (
    req: Request,
    res: Response
) => {

    try {

        const qualification = await Qualification.findOne({

            _id: req.params.id,

            isDeleted: false,

        });

        if (!qualification) {

            return res.status(404).json({

                success: false,

                message: "Qualification not found.",

            });

        }

        return res.status(200).json({

            success: true,

            data: qualification,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// UPDATE QUALIFICATION

export const updateQualification = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = updateQualificationSchema.parse({

            body: req.body,

        });

        const qualification = await Qualification.findOneAndUpdate(

            {

                _id: req.params.id,

                isDeleted: false,

            },

            {

                $set: validatedData.body,

            },

            {

                new: true,

                runValidators: true,

            }

        );

        if (!qualification) {

            return res.status(404).json({

                success: false,

                message: "Qualification not found.",

            });

        }

        return res.status(200).json({

            success: true,

            message: "Qualification updated successfully.",

            data: qualification,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// DELETE QUALIFICATION (SOFT DELETE)

export const deleteQualification = async (
    req: Request,
    res: Response
) => {

    try {

        const qualification = await Qualification.findOneAndUpdate(

            {

                _id: req.params.id,

                isDeleted: false,

            },

            {

                isDeleted: true,

            },

            {

                new: true,

            }

        );

        if (!qualification) {

            return res.status(404).json({

                success: false,

                message: "Qualification not found.",

            });

        }

        return res.status(200).json({

            success: true,

            message: "Qualification deleted successfully.",

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};