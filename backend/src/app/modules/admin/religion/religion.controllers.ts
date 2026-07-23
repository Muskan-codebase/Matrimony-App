import { Request, Response } from "express";
import { Religion } from "./religion.model";
import { createReligionSchema, updateReligionSchema } from "./religion.validation";

export const createReligion = async (req: Request, res: Response) => {

    try {

        const validatedData = createReligionSchema.parse({
            body: req.body,
        });

        const existingReligion = await Religion.findOne({
            religion: validatedData.body.religion,
            isDeleted: false,

        });

        if (existingReligion) {

            return res.status(409).json({
                success: false,
                message: "Religion already exists.",
            });

        }

        const religion = await Religion.create({
            religion: validatedData.body.religion,
        });

        return res.status(201).json({
            success: true,
            message: "Religion created successfully.",
            data: religion,

        });

    }

    catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,

        });

    }

};

export const getReligions = async (req: Request, res: Response) => {

    try {

        const religions = await Religion.find({
            isDeleted: false,
        }).sort({
            religion: 1,
        });

        return res.status(200).json({
            success: true,
            count: religions.length,
            data: religions,
        });

    }

    catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const getReligionById = async (
    req: Request,
    res: Response
) => {

    try {

        const religion = await Religion.findOne({

            _id: req.params.id,

            isDeleted: false,

        });

        if (!religion) {

            return res.status(404).json({

                success: false,

                message: "Religion not found.",

            });

        }

        return res.status(200).json({

            success: true,

            data: religion,

        });

    } catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

export const updateReligion = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = updateReligionSchema.parse({

            body: req.body,

        });

        if (validatedData.body.religion) {

            const existingReligion = await Religion.findOne({

                religion: validatedData.body.religion,

                _id: {

                    $ne: req.params.id,

                },

                isDeleted: false,

            });

            if (existingReligion) {

                return res.status(409).json({

                    success: false,

                    message: "Religion already exists.",

                });

            }

        }

        const religion = await Religion.findOneAndUpdate(

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

        if (!religion) {

            return res.status(404).json({

                success: false,

                message: "Religion not found.",

            });

        }

        return res.status(200).json({

            success: true,

            message: "Religion updated successfully.",

            data: religion,

        });

    } catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

export const deleteReligion = async (
    req: Request,
    res: Response
) => {

    try {

        const religion = await Religion.findOneAndUpdate(

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

        if (!religion) {

            return res.status(404).json({

                success: false,

                message: "Religion not found.",

            });

        }

        return res.status(200).json({

            success: true,

            message: "Religion deleted successfully.",

        });

    } catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};