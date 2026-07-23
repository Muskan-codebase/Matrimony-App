import { Request, Response } from "express";
import { SuccessStory } from "./successStory.model";
import {
    createSuccessStorySchema,
    updateSuccessStorySchema,
} from "./successStory.validation";

// Create Success Story
export const createSuccessStory = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const validatedData =
            createSuccessStorySchema.parse({
                ...req.body,
                year: Number(req.body.year),
                image: req.file?.path,
            });

        const successStory = await SuccessStory.create(
            validatedData
        );

        res.status(201).json({
            success: true,
            message: "Success story created successfully.",
            data: successStory,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const getSuccessStories = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter: any = {
            isDeleted: false,
        };

        if (req.query.year) {
            filter.year = Number(req.query.year);
        }

        if (req.query.search) {

            filter.$or = [

                {
                    groomName: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },

                {
                    brideName: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },

            ];

        }

        const total = await SuccessStory.countDocuments(filter);

        const successStories = await SuccessStory.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            data: successStories,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const getSuccessStoryById = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const successStory =
            await SuccessStory.findOne({

                _id: req.params.id,

                isDeleted: false,

            });

        if (!successStory) {

            res.status(404).json({
                success: false,
                message: "Success story not found.",
            });

            return;

        }

        res.status(200).json({
            success: true,
            data: successStory,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const updateSuccessStory = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const existingStory =
            await SuccessStory.findOne({

                _id: req.params.id,

                isDeleted: false,

            });

        if (!existingStory) {

            res.status(404).json({
                success: false,
                message: "Success story not found.",
            });

            return;

        }

        const validatedData =
            updateSuccessStorySchema.parse({

                ...req.body,

                ...(req.body.year && {
                    year: Number(req.body.year),
                }),

                ...(req.file && {
                    image: req.file.path,
                }),

            });

        Object.assign(
            existingStory,
            validatedData
        );

        await existingStory.save();

        res.status(200).json({
            success: true,
            message: "Success story updated successfully.",
            data: existingStory,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const deleteSuccessStory = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const successStory =
            await SuccessStory.findOne({

                _id: req.params.id,

                isDeleted: false,

            });

        if (!successStory) {

            res.status(404).json({
                success: false,
                message: "Success story not found.",
            });

            return;

        }

        successStory.isDeleted = true;

        await successStory.save();

        res.status(200).json({
            success: true,
            message: "Success story deleted successfully.",
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};