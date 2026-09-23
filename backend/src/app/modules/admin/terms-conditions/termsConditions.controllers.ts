import { Request, Response } from "express";
import { TermsConditions } from "./termsConditions.model";
import { termsConditionsSchema } from "./termsConditions.validation";

export const createOrUpdateTermsConditions = async (
    req: Request,
    res: Response
) => {
    try {
        const validationResult = termsConditionsSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }

        const termsConditions = await TermsConditions.findOneAndUpdate(
            {},
            {
                $set: validationResult.data,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Terms & Conditions saved successfully",
            data: termsConditions,
        });
    } catch (error) {
        console.error(
            "Create/Update Terms & Conditions Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to save Terms & Conditions",
        });
    }
};


export const getTermsConditions = async (
    req: Request,
    res: Response
) => {
    try {
        const termsConditions =
            await TermsConditions.findOne().lean();

        if (!termsConditions) {
            return res.status(404).json({
                success: false,
                message: "Terms & Conditions not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Terms & Conditions fetched successfully",
            data: termsConditions,
        });
    } catch (error) {
        console.error(
            "Get Terms & Conditions Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Terms & Conditions",
        });
    }
};