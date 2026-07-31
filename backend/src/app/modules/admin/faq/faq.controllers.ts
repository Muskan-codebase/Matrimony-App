import { Request, Response } from "express";
import { FAQ } from "./faq.model";
import { createFAQSchema, updateFAQSchema } from "./faq.validation";

export const createFAQ = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = createFAQSchema.parse(req.body);

        const faq = await FAQ.create(validatedData);

        res.status(201).json({
            success: true,
            message: "FAQ created successfully.",
            data: faq,
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: error.errors,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};

export const getFAQs = async (req: Request, res: Response): Promise<void> => {
    try {
        const faqs = await FAQ.find({
            isDeleted: false,
            isActive: true,
        }).sort({ displayOrder: 1 });

        res.status(200).json({
            success: true,
            data: faqs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};

export const getFAQById = async (req: Request, res: Response): Promise<void> => {
    try {
        const faq = await FAQ.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!faq) {
            res.status(404).json({
                success: false,
                message: "FAQ not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: faq,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};

export const updateFAQ = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = updateFAQSchema.parse(req.body);

        const faq = await FAQ.findOneAndUpdate(
            {
                _id: req.params.id,
                isDeleted: false,
            },
            validatedData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!faq) {
            res.status(404).json({
                success: false,
                message: "FAQ not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "FAQ updated successfully.",
            data: faq,
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: error.errors,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};

export const deleteFAQ = async (req: Request, res: Response): Promise<void> => {
    try {
        const faq = await FAQ.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
            },
            {
                new: true,
            }
        );

        if (!faq) {
            res.status(404).json({
                success: false,
                message: "FAQ not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "FAQ deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};