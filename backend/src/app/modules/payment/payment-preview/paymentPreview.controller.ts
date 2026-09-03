import { Request, Response } from "express";
import { Types } from "mongoose";
import { previewPayment } from "../../../services/previewPayment.service";

export const previewPaymentController = async (
    req: Request,
    res: Response
) => {
    try {
        const { profileId, packageId } = req.body;

        if (!profileId || !packageId) {
            return res.status(400).json({
                success: false,
                message:
                    "profileId and packageId are required",
            });
        }

        if (
            !Types.ObjectId.isValid(profileId) ||
            !Types.ObjectId.isValid(packageId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid profileId or packageId",
            });
        }

        const result = await previewPayment(
            new Types.ObjectId(profileId),
            new Types.ObjectId(packageId)
        );

        return res.status(200).json({
            success: true,
            message: "Payment preview fetched successfully",
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch payment preview",
        });
    }
};