import { Request, Response } from "express";
import { Location } from "./location.model";
import {
    createLocationSchema,
    updateLocationSchema,
} from "./location.validation";

export const createLocation = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = createLocationSchema.parse({
            body: req.body,
        });

        const existingLocation = await Location.findOne({
            country: validatedData.body.country,
            state: validatedData.body.state,
            city: validatedData.body.city,
            isDeleted: false,
        });

        if (existingLocation) {

            return res.status(409).json({
                success: false,
                message: "Location already exists.",
            });

        }

        const location = await Location.create(validatedData.body);

        return res.status(201).json({
            success: true,
            message: "Location created successfully.",
            data: location,
        });

    }

    catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const getLocations = async (
    req: Request,
    res: Response
) => {

    try {

        const locations = await Location.find({
            isDeleted: false,
        });

        return res.status(200).json({
            success: true,
            count: locations.length,
            data: locations,
        });

    }

    catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const getLocationById = async (
    req: Request,
    res: Response
) => {

    try {

        const location = await Location.findOne({

            _id: req.params.id,

            isDeleted: false,

        });

        if (!location) {

            return res.status(404).json({

                success: false,

                message: "Location not found.",

            });

        }

        return res.status(200).json({

            success: true,

            data: location,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

export const updateLocation = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = updateLocationSchema.parse({

            body: req.body,

        });

        const location = await Location.findOneAndUpdate(

            {

                _id: req.params.id,

                isDeleted: false,

            },

            {

                $set: validatedData.body,

            },

            {

                new: true,

                runValidators: true,

            }

        );

        if (!location) {

            return res.status(404).json({

                success: false,

                message: "Location not found.",

            });

        }

        return res.status(200).json({

            success: true,

            message: "Location updated successfully.",

            data: location,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

export const deleteLocation = async (
    req: Request,
    res: Response
) => {

    try {

        const location = await Location.findOneAndUpdate(

            {

                _id: req.params.id,

                isDeleted: false,

            },

            {

                isDeleted: true,

            },

            {

                new: true,

            }

        );

        if (!location) {

            return res.status(404).json({

                success: false,

                message: "Location not found.",

            });

        }

        return res.status(200).json({

            success: true,

            message: "Location deleted successfully.",

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};