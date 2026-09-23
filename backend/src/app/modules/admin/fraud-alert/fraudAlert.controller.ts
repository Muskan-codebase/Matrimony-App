import { Request, Response } from "express";
import { FraudAlert } from "./fraudAlert.model";
import { fraudAlertSchema } from "./fraudAlert.validation";

export const createOrUpdateFraudAlert = async (
    req: Request,
    res: Response
) => {
    try {
        const validationResult = fraudAlertSchema.safeParse(
            req.body
        );

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }

        const fraudAlert = await FraudAlert.findOneAndUpdate(
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
            message: "Fraud & Alert saved successfully",
            data: fraudAlert,
        });
    } catch (error) {
        console.error(
            "Create/Update Fraud & Alert Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to save Fraud & Alert",
        });
    }
};

export const getFraudAlert = async (
    req: Request,
    res: Response
) => {
    try {
        const fraudAlert =
            await FraudAlert.findOne().lean();

        if (!fraudAlert) {
            return res.status(404).json({
                success: false,
                message: "Fraud & Alert not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Fraud & Alert fetched successfully",
            data: fraudAlert,
        });
    } catch (error) {
        console.error(
            "Get Fraud & Alert Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Fraud & Alert",
        });
    }
};