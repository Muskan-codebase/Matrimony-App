import { Request, Response } from "express";
import { createPressSchema, updatePressSchema } from "./press.validation";
import mongoose from "mongoose";
import { Press } from "./press.model";

export const createPress = async (req: Request, res: Response) => {
    try {

        const image = req.file?.path;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Press image is required",
            });
        }

        const validationResult = createPressSchema.safeParse({
            ...req.body,
            image,
        });

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }

        const press = await Press.create(validationResult.data);

        return res.status(201).json({
            success: true,
            message: "Press article created successfully",
            data: press,
        });
    } catch (error) {
        console.error("Create Press Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create press article",
        });
    }
};

export const getPress = async (req: Request, res: Response) => {

    try {
        const press = await Press.find()
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: "Press articles fetched successfully",
            data: press,
        });
    } catch (error) {
        console.error("Get Press Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch press articles",
        });
    }
};

export const getPressById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid press article ID",
            });
        }

        const press = await Press.findById(id).lean();

        if (!press) {
            return res.status(404).json({
                success: false,
                message: "Press article not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Press article fetched successfully",
            data: press,
        });
    } catch (error) {
        console.error("Get Press By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch press article",
        });
    }
};

export const updatePress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid press article ID",
            });
        }

        const validationResult = updatePressSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }

        const updateData = {
            ...validationResult.data,
            ...(req.file?.path && {
                image: req.file.path,
            }),
        };

        const press = await Press.findByIdAndUpdate(
            id,
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!press) {
            return res.status(404).json({
                success: false,
                message: "Press article not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Press article updated successfully",
            data: press,
        });
    } catch (error) {
        console.error("Update Press Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update press article",
        });
    }
};

export const deletePress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid press article ID",
            });
        }

        const press = await Press.findByIdAndDelete(id);

        if (!press) {
            return res.status(404).json({
                success: false,
                message: "Press article not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Press article deleted successfully",
        });
    } catch (error) {
        console.error("Delete Press Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete press article",
        });
    }
};