import { Request, Response } from "express";
import { Occupation } from "./occupation.model";
import { createOccupationSchema } from "./occupation.validation";

export const createOccupation = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const validatedData = createOccupationSchema.parse({
            body: req.body,
        });

        const { occupation } = validatedData.body;

        const existingOccupation = await Occupation.findOne({
            occupation: {
                $regex: new RegExp(`^${occupation}$`, "i"),
            },
            isDeleted: false,
        });

        if (existingOccupation) {
            res.status(409).json({
                success: false,
                message: "Occupation already exists.",
            });
            return;
        }

        const newOccupation = await Occupation.create({
            occupation,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Occupation created successfully.",
            data: newOccupation,
        });
    } catch (error: any) {
        console.error("Create Occupation Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const getOccupations = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const occupations = await Occupation.find({
            isDeleted: false,
        })
            .sort({ occupation: 1 });

        res.status(200).json({
            success: true,
            message: "Occupations fetched successfully.",
            data: occupations,
        });
    } catch (error: any) {
        console.error("Get Occupations Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const getOccupationById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const occupation = await Occupation.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!occupation) {
            res.status(404).json({
                success: false,
                message: "Occupation not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Occupation fetched successfully.",
            data: occupation,
        });
    } catch (error: any) {
        console.error("Get Occupation Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const updateOccupation = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { occupation } = req.body;

        const existingOccupation = await Occupation.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!existingOccupation) {
            res.status(404).json({
                success: false,
                message: "Occupation not found.",
            });
            return;
        }

        const duplicateOccupation = await Occupation.findOne({
            occupation: {
                $regex: new RegExp(`^${occupation}$`, "i"),
            },
            _id: { $ne: req.params.id },
            isDeleted: false,
        });

        if (duplicateOccupation) {
            res.status(409).json({
                success: false,
                message: "Occupation already exists.",
            });
            return;
        }

        existingOccupation.occupation = occupation;

        await existingOccupation.save();

        res.status(200).json({
            success: true,
            message: "Occupation updated successfully.",
            data: existingOccupation,
        });
    } catch (error: any) {
        console.error("Update Occupation Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const deleteOccupation = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const occupation = await Occupation.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!occupation) {
            res.status(404).json({
                success: false,
                message: "Occupation not found.",
            });
            return;
        }

        occupation.isDeleted = true;

        await occupation.save();

        res.status(200).json({
            success: true,
            message: "Occupation deleted successfully.",
        });
    } catch (error: any) {
        console.error("Delete Occupation Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};