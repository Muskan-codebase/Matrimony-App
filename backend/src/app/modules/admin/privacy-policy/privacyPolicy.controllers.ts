import { Request, Response } from "express";
import { PrivacyPolicy } from "./privacyPolicy.model";
import { privacyPolicySchema } from "./privacyPolicy.validation";

export const createOrUpdatePrivacyPolicy = async (req: Request, res: Response) => {
    try {
        const validationResult = privacyPolicySchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }

        const privacyPolicy = await PrivacyPolicy.findOneAndUpdate(
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
            message: "Privacy Policy saved successfully",
            data: privacyPolicy,
        });
    } catch (error) {
        console.error("Create/Update Privacy Policy Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save Privacy Policy",
        });
    }
};

export const getPrivacyPolicy = async (req: Request, res: Response) => {

    try {
        const privacyPolicy = await PrivacyPolicy.findOne().lean();

        if (!privacyPolicy) {
            return res.status(404).json({
                success: false,
                message: "Privacy Policy not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Privacy Policy fetched successfully",
            data: privacyPolicy,
        });
    } catch (error) {
        console.error("Get Privacy Policy Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Privacy Policy",
        });
    }
};