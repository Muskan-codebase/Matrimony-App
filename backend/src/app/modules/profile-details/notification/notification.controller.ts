import { Request, Response } from "express";
import { ZodError } from "zod";
import * as notificationService from "./notification.service";
import { registerTokenSchema } from "./notification.validation";

export const registerToken = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const { token } = registerTokenSchema.parse(req.body);

        await notificationService.registerToken(
            req.user._id,
            token
        );

        return res.status(200).json({
            success: true,
            message: "FCM token registered successfully.",
        });

    } catch (error: any) {

        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: error.issues[0].message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};