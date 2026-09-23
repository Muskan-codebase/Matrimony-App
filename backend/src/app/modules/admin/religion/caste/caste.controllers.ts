import { Request, Response } from "express";
import { Caste } from "./caste.model";
import { Religion } from "../religion.model";
import {
    createCasteSchema,
    updateCasteSchema,
} from "./caste.validation";

// CREATE CASTE

export const createCaste = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = createCasteSchema.parse({
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

        const existing = await Caste.findOne({

            religionId: validatedData.body.religionId,

            caste: validatedData.body.caste,

            isDeleted: false,

        });

        if (existing) {

            return res.status(409).json({

                success: false,

                message: "Caste already exists.",

            });

        }

        const caste = await Caste.create(validatedData.body);

        return res.status(201).json({

            success: true,

            message: "Caste created successfully.",

            data: caste,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// GET ALL CASTES

export const getCastes = async (
    req: Request,
    res: Response
) => {

    try {

        const castes = await Caste.find({

            isDeleted: false,

        }).populate("religionId", "religion");

        return res.status(200).json({

            success: true,

            count: castes.length,

            data: castes,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// GET CASTES BY RELIGION

export const getCastesByReligion = async (
    req: Request,
    res: Response
) => {

    try {

        const castes = await Caste.find({

            religionId: req.params.religionId,

            isDeleted: false,

        });

        return res.status(200).json({

            success: true,

            count: castes.length,

            data: castes,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// GET CASTE BY ID

export const getCasteById = async (
    req: Request,
    res: Response
) => {

    try {

        const caste = await Caste.findOne({

            _id: req.params.id,

            isDeleted: false,

        }).populate("religionId", "religion");

        if (!caste) {

            return res.status(404).json({

                success: false,

                message: "Caste not found.",

            });

        }

        return res.status(200).json({

            success: true,

            data: caste,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// UPDATE CASTE

export const updateCaste = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = updateCasteSchema.parse({

            body: req.body,

        });

        const caste = await Caste.findOneAndUpdate(

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

        if (!caste) {

            return res.status(404).json({

                success: false,

                message: "Caste not found.",

            });

        }

        return res.status(200).json({

            success: true,

            message: "Caste updated successfully.",

            data: caste,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

// DELETE CASTE

export const deleteCaste = async (
    req: Request,
    res: Response
) => {

    try {

        const caste = await Caste.findOneAndUpdate(

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

        if (!caste) {

            return res.status(404).json({

                success: false,

                message: "Caste not found.",

            });

        }

        return res.status(200).json({

            success: true,

            message: "Caste deleted successfully.",

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};