// health.controller.ts

import { Request, Response } from "express";

export const healthCheck = async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "SahaJeevan server is running",
    });
};