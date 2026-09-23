import { Request, Response } from "express";
import { MotherTongue } from "./motherTongue.model";

export const createMotherTongue = async (
    req: Request,
    res: Response
) => {

    try {

        const { motherTongue } = req.body;

        const exists = await MotherTongue.findOne({
            motherTongue,
            isDeleted: false,
        });

        if (exists) {

            return res.status(409).json({
                success: false,
                message: "Mother tongue already exists.",
            });

        }

        const newMotherTongue = await MotherTongue.create({
            motherTongue,
        });

        return res.status(201).json({
            success: true,
            message: "Mother tongue created successfully.",
            data: newMotherTongue,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });

    }

};

export const getMotherTongues = async (
    req: Request,
    res: Response
) => {

    try {

        const motherTongues = await MotherTongue.find({
            isDeleted: false,
        }).sort({
            motherTongue: 1,
        });

        return res.status(200).json({
            success: true,
            data: motherTongues,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });

    }

};

export const getMotherTongueById = async (
    req: Request,
    res: Response
) => {

    try {

        const { id } = req.params;

        const motherTongue = await MotherTongue.findOne({
            _id: id,
            isDeleted: false,
        });

        if (!motherTongue) {

            return res.status(404).json({
                success: false,
                message: "Mother tongue not found.",
            });

        }

        return res.status(200).json({
            success: true,
            data: motherTongue,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });

    }

};

export const updateMotherTongue = async (
    req: Request,
    res: Response
) => {

    try {

        const { id } = req.params;

        const { motherTongue } = req.body;

        if (motherTongue) {

            const exists = await MotherTongue.findOne({
                motherTongue,
                isDeleted: false,
                _id: { $ne: id },
            });

            if (exists) {

                return res.status(409).json({
                    success: false,
                    message: "Mother tongue already exists.",
                });

            }

        }

        const updatedMotherTongue = await MotherTongue.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedMotherTongue) {

            return res.status(404).json({
                success: false,
                message: "Mother tongue not found.",
            });

        }

        return res.status(200).json({
            success: true,
            message: "Mother tongue updated successfully.",
            data: updatedMotherTongue,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });

    }

};

export const deleteMotherTongue = async (
    req: Request,
    res: Response
) => {

    try {

        const { id } = req.params;

        const deletedMotherTongue = await MotherTongue.findOneAndUpdate(
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

        if (!deletedMotherTongue) {

            return res.status(404).json({
                success: false,
                message: "Mother tongue not found.",
            });

        }

        return res.status(200).json({
            success: true,
            message: "Mother tongue deleted successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });

    }

};