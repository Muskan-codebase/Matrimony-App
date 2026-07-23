import { Request, Response } from "express";
import { Height } from "./height.model";
import {
    createHeightSchema,
    updateHeightSchema,
} from "./height.validation";

// CREATE HEIGHT

export const createHeight = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = createHeightSchema.parse({
            body: req.body,
        });

        const existingHeight = await Height.findOne({
            height: validatedData.body.height,
            isDeleted: false,
        });

        if (existingHeight) {
            return res.status(409).json({
                success: false,
                message: "Height already exists.",
            });
        }

        const height = await Height.create(validatedData.body);

        return res.status(201).json({
            success: true,
            message: "Height created successfully.",
            data: height,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

// GET ALL HEIGHTS

export const getHeights = async (
    req: Request,
    res: Response
) => {

    try {

        const heights = await Height.find({
            isDeleted: false,
        });

        return res.status(200).json({
            success: true,
            count: heights.length,
            data: heights,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

// GET HEIGHT BY ID

export const getHeightById = async (
    req: Request,
    res: Response
) => {

    try {

        const height = await Height.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!height) {
            return res.status(404).json({
                success: false,
                message: "Height not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: height,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

// UPDATE HEIGHT

export const updateHeight = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = updateHeightSchema.parse({
            body: req.body,
        });

        const height = await Height.findOneAndUpdate(

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

        if (!height) {
            return res.status(404).json({
                success: false,
                message: "Height not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Height updated successfully.",
            data: height,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

// SOFT DELETE HEIGHT

export const deleteHeight = async (
    req: Request,
    res: Response
) => {

    try {

        const height = await Height.findOneAndUpdate(

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

        if (!height) {
            return res.status(404).json({
                success: false,
                message: "Height not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Height deleted successfully.",
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};