import { Request, Response } from "express";
import { AboutUs } from "./aboutUs.model";
import { createAboutUsValidation } from "./aboutUs.validation";

export const createOrUpdateAboutUs = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const body = JSON.parse(req.body.data);

        if (files?.ceoImage?.length) {
            body.ceoSection.image = files.ceoImage[0].path;
        }

        if (files?.aboutImage?.length) {
            body.aboutSection.image = files.aboutImage[0].path;
        }

        const validatedData = createAboutUsValidation.parse(body);

        const aboutUs = await AboutUs.findOneAndUpdate(
            { isDeleted: false },
            validatedData,
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "About Us saved successfully.",
            data: aboutUs,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAboutUs = async (req: Request, res: Response): Promise<void> => {
    try {
        const aboutUs = await AboutUs.findOne({
            isDeleted: false,
        });

        res.status(200).json({
            success: true,
            data: aboutUs,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};