import { Request, Response } from "express";
import { Banner } from "./heroBanner.model";
import { createBannerSchema, updateBannerSchema } from "./heroBanner.validation";

export const createBanner = async (req: Request, res: Response): Promise<void> => {
    try {
        const image = (req.file as any)?.path;

        if (!image) {
            res.status(400).json({
                success: false,
                message: "Banner image is required.",
            });
            return;
        }

        const validatedData = createBannerSchema.parse({
            ...req.body,
            image,
            displayOrder: req.body.displayOrder
                ? Number(req.body.displayOrder)
                : undefined,
            isActive:
                req.body.isActive !== undefined
                    ? req.body.isActive === "true"
                    : undefined,
        });

        const banner = await Banner.create(validatedData);

        res.status(201).json({
            success: true,
            message: "Banner created successfully.",
            data: banner,
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
            error: error.message,
        });
    }
};

export const updateBanner = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const existingBanner = await Banner.findOne({
            _id: id,
            isDeleted: false,
        });

        if (!existingBanner) {
            res.status(404).json({
                success: false,
                message: "Banner not found.",
            });
            return;
        }

        const updatedData: any = {
            ...req.body,
        };

        // Update image only if a new file is uploaded
        if (req.file) {
            updatedData.image = (req.file as any).path;
        }

        // Convert multipart/form-data string values
        if (updatedData.displayOrder !== undefined) {
            updatedData.displayOrder = Number(updatedData.displayOrder);
        }

        if (updatedData.isActive !== undefined) {
            updatedData.isActive = updatedData.isActive === "true";
        }

        const validatedData = updateBannerSchema.parse(updatedData);

        const banner = await Banner.findByIdAndUpdate(
            id,
            validatedData,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Banner updated successfully.",
            data: banner,
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
            error: error.message,
        });
    }
};

export const getBanners = async (req: Request, res: Response): Promise<void> => {

    try {

        const banners = await Banner.find();

        if (!banners) {
            res.status(400).json({
                success: false,
                message: "No banners found"
            })

            return
        }

        res.status(200).json({
            success: true,
            message: "Banners fetched successfully",
            data: banners
        })

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
            error: error.message,
        });
    }
}

export const getBanner = async (req: Request, res: Response): Promise<void> => {

    try {

        const id = req.params;

        const banner = await Banner.findById(id);

        if (!banner) {
            res.status(400).json({
                success: false,
                message: "Banner not found!"
            })
            return;
        }

        res.status(200).json({
            success: true,
            message: "Banner fetched successfully",
            data: banner
        })

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
            error: error.message,
        });
    }
}

export const deleteBanner = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        const banner = await Banner.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                isDeleted: true,
            },
            {
                new: true,
            }
        );

        if (!banner) {
            res.status(404).json({
                success: false,
                message: "Banner not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Banner deleted successfully.",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};