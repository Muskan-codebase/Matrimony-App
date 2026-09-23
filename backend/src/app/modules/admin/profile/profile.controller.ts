import { Request, Response } from "express";
import mongoose from "mongoose";
import { Profile } from "../../profile-details/profile.model";
import { createProfileSchema, updateProfileSchema } from "../../profile-details/profile.validation";
import { generateMatrimonyId } from "../../profile-details/profile.controllers";

export const addProfile = async (req: Request, res: Response) => {

    try {

        let profileBody;

        try {
            profileBody =
                typeof req.body.data === "string"
                    ? JSON.parse(req.body.data)
                    : req.body.data;
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON data.",
            });
        }

        const validation = createProfileSchema.safeParse({
            body: profileBody,
        });

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten(),
            });
        }

        const { basicDetails, ...profileData } = validation.data.body;

        if (!basicDetails) {
            return res.status(400).json({
                success: false,
                message: "Basic details are required to create a profile.",
            });
        }

        const matrimonyId = generateMatrimonyId(
            basicDetails.firstName,
            basicDetails.lastName,
            basicDetails.dob
        );

        const photos = (req.files as Express.Multer.File[] || [])
            .map((file) => file.path);

        const profile = await Profile.create({
            userId: req.user.id,
            matrimonyId,
            basicDetails,
            ...profileData,
            photos,
        });

        return res.status(201).json({
            success: true,
            message: "Profile added successfully",
            data: profile,
        });

    } catch (error: any) {
        console.error("Add Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add profile",
            error: error.message,
        });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile ID",
            });
        }

        const validation = updateProfileSchema.safeParse({
            body: req.body
        });

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten(),
            });
        }

        const uploadedPhotos = (req.files as Express.Multer.File[] || [])
            .map((file) => file.path);

        const updateData = {
            ...validation.data.body,
        };

        if (uploadedPhotos.length > 0) {
            updateData.photos = uploadedPhotos;
        }

        const profile = await Profile.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profile,
        });

    } catch (error: any) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
};

export const getAllProfiles = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const [profiles, totalProfiles] = await Promise.all([
            Profile.find({
                isDeleted: false,
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Profile.countDocuments({
                isDeleted: false,
            }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Profiles fetched successfully",
            data: profiles,
            pagination: {
                currentPage: page,
                limit,
                totalProfiles,
                totalPages: Math.ceil(totalProfiles / limit),
            },
        });

    } catch (error: any) {
        console.error("Get All Profiles Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profiles",
            error: error.message,
        });
    }
};

export const getProfileById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile ID",
            });
        }

        const profile = await Profile.findOne({
            _id: id,
            isDeleted: false,
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: profile,
        });

    } catch (error: any) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
};

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile ID",
            });
        }

        const profile = await Profile.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: {
                    isDeleted: true,
                },
            },
            {
                new: true,
            }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        });

    } catch (error: any) {
        console.error("Delete Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete profile",
            error: error.message,
        });
    }
};