import { Request, Response } from "express";
import { Religion } from "../../religion.model";
import { Caste } from "../caste.model";
import { SubCaste } from "./subCaste.model";
import {
    createSubCasteSchema,
    updateSubCasteSchema,
} from "./subCaste.validation";

// CREATE

export const createSubCaste = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = createSubCasteSchema.parse({
            body: req.body,
        });

        const religion = await Religion.findOne({
            _id: validatedData.body.religionId,
            isDeleted: false,
        });

        if (!religion) {

            return res.status(404).json({
                success: false,
                message: "Religion not found.",
            });

        }

        const caste = await Caste.findOne({

            _id: validatedData.body.casteId,

            religionId: validatedData.body.religionId,

            isDeleted: false,

        });

        if (!caste) {

            return res.status(404).json({

                success: false,

                message: "Caste not found.",

            });

        }

        const existing = await SubCaste.findOne({

            casteId: validatedData.body.casteId,

            subCaste: validatedData.body.subCaste,

            isDeleted: false,

        });

        if (existing) {

            return res.status(409).json({

                success: false,

                message: "Sub-caste already exists.",

            });

        }

        const subCaste = await SubCaste.create(validatedData.body);

        return res.status(201).json({

            success: true,

            message: "Sub-caste created successfully.",

            data: subCaste,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// GET ALL

export const getSubCastes = async (
    req: Request,
    res: Response
) => {

    try {

        const subCastes = await SubCaste.find({

            isDeleted: false,

        })
            .populate("religionId", "religion")
            .populate("casteId", "caste");

        return res.status(200).json({

            success: true,

            count: subCastes.length,

            data: subCastes,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// GET BY CASTE

export const getSubCastesByCaste = async (
    req: Request,
    res: Response
) => {

    try {

        const subCastes = await SubCaste.find({

            casteId: req.params.casteId,

            isDeleted: false,

        });

        return res.status(200).json({

            success: true,

            count: subCastes.length,

            data: subCastes,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// GET BY ID

export const getSubCasteById = async (
    req: Request,
    res: Response
) => {

    try {

        const subCaste = await SubCaste.findOne({

            _id: req.params.id,

            isDeleted: false,

        })
            .populate("religionId", "religion")
            .populate("casteId", "caste");

        if (!subCaste) {

            return res.status(404).json({

                success: false,

                message: "Sub-caste not found.",

            });

        }

        return res.status(200).json({

            success: true,

            data: subCaste,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// UPDATE

export const updateSubCaste = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = updateSubCasteSchema.parse({

            body: req.body,

        });

        const subCaste = await SubCaste.findOneAndUpdate(

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

        if (!subCaste) {

            return res.status(404).json({

                success: false,

                message: "Sub-caste not found.",

            });

        }

        return res.status(200).json({

            success: true,

            message: "Sub-caste updated successfully.",

            data: subCaste,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// DELETE

export const deleteSubCaste = async (
    req: Request,
    res: Response
) => {

    try {

        const subCaste = await SubCaste.findOneAndUpdate(

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

        if (!subCaste) {

            return res.status(404).json({

                success: false,

                message: "Sub-caste not found.",

            });

        }

        return res.status(200).json({

            success: true,

            message: "Sub-caste deleted successfully.",

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};