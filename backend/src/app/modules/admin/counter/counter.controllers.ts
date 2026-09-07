import { Request, Response } from "express";
import { Counter } from "./counter.model";
import { createOrUpdateCounterSchema } from "./counter.validation";

// Create Counter if it doesn't exist
// Update Counter if it already exists
export const createOrUpdateCounter = async (req: Request, res: Response) => {
    try {
        const validatedData = createOrUpdateCounterSchema.parse(req.body);

        const existingCounter = await Counter.findOne();

        if (existingCounter) {
            existingCounter.mobileVerifiedProfiles =
                validatedData.mobileVerifiedProfiles;

            existingCounter.customersServed =
                validatedData.customersServed;

            existingCounter.successfulMatchmakingYears =
                validatedData.successfulMatchmakingYears;

            await existingCounter.save();

            return res.status(200).json({
                success: true,
                message: "Counter updated successfully",
                data: existingCounter,
            });
        }

        const counter = await Counter.create(validatedData);

        return res.status(201).json({
            success: true,
            message: "Counter created successfully",
            data: counter,
        });
    } catch (error: any) {
        console.error("Counter create/update error:", error);

        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to create/update counter",
        });
    }
};

// Get Counter
export const getCounter = async (req: Request, res: Response) => {
    try {
        const counter = await Counter.findOne().lean();

        if (!counter) {
            return res.status(404).json({
                success: false,
                message: "Counter not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Counter fetched successfully",
            data: counter,
        });
    } catch (error: any) {
        console.error("Get counter error:", error);

        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to fetch counter",
        });
    }
};