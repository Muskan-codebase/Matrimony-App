import { Request, Response } from "express";
import mongoose from "mongoose";

import Experience from "./experience.model";
import {
    createExperienceSchema,
    updateExperienceSchema,
} from "./experience.validation";

// POST - Create Experience
export const createExperience = async (req: Request, res: Response) => {
    try {
        const validationResult =
            createExperienceSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }

        const experience = await Experience.create(
            validationResult.data
        );

        return res.status(201).json({
            success: true,
            message: "Experience created successfully",
            data: experience,
        });
    } catch (error: any) {
        console.error("Create Experience Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create experience",
            error: error.message,
        });
    }
};

// GET - Get All Experiences
export const getExperiences = async (req: Request, res: Response) => {
    try {
        const experiences = await Experience.find()
            .sort({ sortOrder: 1, createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: "Experiences fetched successfully",
            count: experiences.length,
            data: experiences,
        });
    } catch (error: any) {
        console.error("Get Experiences Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch experiences",
            error: error.message,
        });
    }
};

// GET BY ID - Get Single Experience
export const getExperienceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID",
            });
        }

        const experience = await Experience.findById(id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Experience fetched successfully",
            data: experience,
        });
    } catch (error: any) {
        console.error(
            "Get Experience By ID Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch experience",
            error: error.message,
        });
    }
};

// PUT BY ID - Update Experience
export const updateExperience = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID",
            });
        }

        const validationResult =
            updateExperienceSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }

        const experience =
            await Experience.findByIdAndUpdate(
                id,
                validationResult.data,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Experience updated successfully",
            data: experience,
        });
    } catch (error: any) {
        console.error(
            "Update Experience Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update experience",
            error: error.message,
        });
    }
};

// DELETE BY ID - Delete Experience
export const deleteExperience = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID",
            });
        }

        const experience =
            await Experience.findByIdAndDelete(id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Experience deleted successfully",
            data: experience,
        });
    } catch (error: any) {
        console.error(
            "Delete Experience Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete experience",
            error: error.message,
        });
    }
};