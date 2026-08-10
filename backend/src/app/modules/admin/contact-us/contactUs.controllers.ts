import { Request, Response } from "express";
import { contactUsSchema } from "./contactUs.validation";
import ContactUs from "./contactUs.model";

//create or update contact us
export const createOrUpdateContactUs = async (req: Request, res: Response) => {

    try {

        const validateData = contactUsSchema.safeParse(req.body);

        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validateData.error.flatten().fieldErrors,
            });
        }

        const contactUs = await ContactUs.findOneAndUpdate(
            {},
            {
                $set: validateData.data
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        )

        return res.status(200).json({
            success: true,
            message: "Contact us details saved successfully",
            data: contactUs
        })

    } catch (error: any) {

        console.error("Create/Update Contact Us Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save Contact Us details",
        });
    }
}

//get contact Us
export const getContactUs = async (req: Request, res: Response) => {
    try {

        const contactUs = await ContactUs.find().lean();

        if (!contactUs) {
            res.status(400).json({
                success: false,
                message: "contact us details not found"
            })

            return;
        }

        return res.status(200).json({
            success: false,
            message: "Contact us details fetched successfully",
            data: contactUs
        })

    } catch (error: any) {

        console.error("Get Contact Us Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Contact Us details",
        });
    }
}