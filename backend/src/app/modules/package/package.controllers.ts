import { Request, Response } from "express";
import Package from "./package.model";
import { createPackageSchema, updatePackageSchema } from "./package.validation";

export const createPackage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const validatedData = createPackageSchema.parse(req.body);

        const existingPackage = await Package.findOne({
            title: validatedData.title,
        });

        if (existingPackage) {
            res.status(400).json({
                success: false,
                message: "Package already exists.",
            });
            return;
        }

        const newPackage = await Package.create(validatedData);

        res.status(201).json({
            success: true,
            message: "Package created successfully.",
            data: newPackage,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPackages = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const packages = await Package.find({
            isDeleted: false,
        }).sort({
            displayOrder: 1,
        });

        res.status(200).json({
            success: true,
            data: packages,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPackageById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const packageData = await Package.findById(req.params.id);

        if (!packageData) {
            res.status(404).json({
                success: false,
                message: "Package not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: packageData,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updatePackage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const validatedData = updatePackageSchema.parse(req.body);

        const packageData = await Package.findById(req.params.id);

        if (!packageData) {
            res.status(404).json({
                success: false,
                message: "Package not found.",
            });
            return;
        }

        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            validatedData,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Package updated successfully.",
            data: updatedPackage,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deletePackage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const packageData = await Package.findById(req.params.id);

        if (!packageData) {
            res.status(404).json({
                success: false,
                message: "Package not found.",
            });
            return;
        }

        packageData.isDeleted = true;
        await packageData.save();

        res.status(200).json({
            success: true,
            message: "Package deleted successfully.",
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};