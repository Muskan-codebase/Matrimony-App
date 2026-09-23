import { Request, Response } from "express";
import { Profile } from "../profile.model";
import { ProfileVerification } from "./profileVerification.model";
import { VerificationStatus } from "./profileVerification.interface";
import { verificationIdSchema, reviewVerificationSchema } from "./profileVerification.validation";

export const submitVerification = async (req: Request, res: Response) => {

    try {

        const authId = req.user.id;

        const files = req.files as {
            selfie?: Express.Multer.File[];
            adhaarFront?: Express.Multer.File[];
        };

        const selfie = files?.selfie?.[0];
        const adhaarFront = files?.adhaarFront?.[0];

        //check if selfie not submitted
        if (!selfie) {

            res.status(400).json({
                success: false,
                message: "Selfie is required"
            })

            return;
        }

        //check if adhaar card not submitted
        if (!adhaarFront) {
            res.status(400).json({
                success: false,
                message: "Adhaar document is required"
            })

            return
        }

        console.log("SELFIE:", selfie);
        console.log("AADHAAR:", adhaarFront);

        //fetch profile by the logged-in user Id
        const profile = await Profile.findOne({
            userId: authId
        })

        //check if verification already exists
        const existingVerification = await ProfileVerification.findOne({
            profileId: profile?._id
        })

        //check if existing verification request is pending
        if (existingVerification?.status === VerificationStatus.PENDING) {
            res.status(400).json({
                success: false,
                message: "Your Verification request is already Pending"
            })

            return;
        }

        //check if user profile is already approved
        if (existingVerification?.status === VerificationStatus.APPROVED) {
            res.status(400).json({
                success: false,
                message: "Your profile is already verified",
            });
            return;
        }

        // Create or update verification
        const verification = await ProfileVerification.findOneAndUpdate(
            {
                profileId: profile?._id,
            },
            {
                profileId: profile?._id,
                selfieUrl: selfie.path,
                adhaarFrontUrl: adhaarFront.path,
                status: VerificationStatus.PENDING,
                rejectionReason: null,
                submittedAt: new Date(),
                reviewedBy: null,
                reviewedAt: null,
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );

        // Make sure profile is not considered verified
        await Profile.findByIdAndUpdate(verification.profileId, {
            isVerified: false,
        });

        return res.status(200).json({
            success: true,
            message:
                "Profile verification submitted successfully",
            data: verification,
        });

    } catch (error: any) {

        console.error(
            "Submit verification error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to submit profile verification",
        });
    }
}

export const getMyVerification = async (req: Request, res: Response) => {

    try {
        const authId = req.user.id;

        //fetch profile isVerified filed
        const profile = await Profile.findOne({
            userId: authId
        }).select("_id isVerified");

        if (!profile) {
            return res.status(400).json({
                success: false,
                message: "Profile not found!"
            })
        }

        //fetch user's verification
        const verification = await ProfileVerification.findOne({
            profileId: profile._id
        })

        return res.status(200).json({
            success: true,
            message: "Profile verification fetched successfully",
            data: {
                isVerified: profile.isVerified,
                verification
            }
        })

    } catch (error: any) {

        console.error(
            "Get my verification error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch profile verification",
        });
    }
}

export const getAllVerifications = async (req: Request, res: Response) => {

    try {

        const { status } = req.query;

        const filter: Record<string, any> = {};

        if (status) {
            filter.status = status
        }

        const verifications = await ProfileVerification.find(filter)
            .populate({
                path: "profileId",
                select:
                    "basicDetails.firstName basicDetails.lastName photos matrimonyId userId"
            })
            .populate({
                path: "reviewedBy",
                select: "email role"
            })
            .sort({
                createdBy: -1
            })

        return res.status(200).json({
            success: true,
            message: "Profile verifications fetched successfully",
            data: verifications
        })

    } catch (error: any) {

        console.error(
            "Get all verifications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch profile verifications",
        });
    }
}

export const getVerificationById = async (
    req: Request,
    res: Response
) => {
    try {
        const validation =
            verificationIdSchema.safeParse(
                req.params
            );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification ID",
            });
        }

        const { id } = validation.data;

        const verification =
            await ProfileVerification.findById(id)
                .populate({
                    path: "profileId",
                    select:
                        "basicDetails.firstName basicDetails.lastName photos matrimonyId userId"
                })
                .populate({
                    path: "reviewedBy",
                    select: "email role"
                })
                .sort({
                    createdBy: -1
                })

        if (!verification) {
            return res.status(404).json({
                success: false,
                message:
                    "Profile verification not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Profile verification fetched successfully",
            data: verification,
        });
    } catch (error: any) {
        console.error(
            "Get verification by ID error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch profile verification",
        });
    }
};

export const reviewVerification = async (
    req: Request,
    res: Response
) => {
    try {
        // Validate ID
        const idValidation = verificationIdSchema.safeParse(req.params);

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification ID",
            });
        }

        // Validate request body
        const bodyValidation = reviewVerificationSchema.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors:
                    bodyValidation.error.flatten(),
            });
        }

        const { id } = idValidation.data;

        const { status, rejectionReason } = bodyValidation.data;

        const adminId = req.user.id;

        // Find verification
        const verification = await ProfileVerification.findById(id);

        if (!verification) {
            return res.status(404).json({
                success: false,
                message: "Profile verification not found",
            });
        }

        // Prevent reviewing an already approved request
        if (verification.status === VerificationStatus.APPROVED) {
            return res.status(400).json({
                success: false,
                message:
                    "This profile is already verified",
            });
        }

        // Update verification
        verification.status = status;
        verification.reviewedBy = adminId;
        verification.reviewedAt = new Date();

        if (status === VerificationStatus.REJECTED) {
            verification.rejectionReason = rejectionReason!;
        } else {
            verification.rejectionReason = null;
        }

        await verification.save();

        // Update Profile verification status
        await Profile.findByIdAndUpdate(
            verification.profileId,
            {
                isVerified: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: status === VerificationStatus.APPROVED
                ? "Profile verified successfully"
                : "Profile verification rejected successfully",
            data: verification,
        });

    } catch (error: any) {
        console.error(
            "Review verification error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to review profile verification",
        });
    }
};

export const deleteVerification = async (
    req: Request,
    res: Response
) => {
    try {
        const validation = verificationIdSchema.safeParse(req.params);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification ID",
            });
        }

        const { id } = validation.data;

        const verification = await ProfileVerification.findById(id);

        if (!verification) {
            return res.status(404).json({
                success: false,
                message:
                    "Profile verification not found",
            });
        }

        await ProfileVerification.findByIdAndDelete(id);

        // Make sure profile is not considered verified
        await Profile.findByIdAndUpdate(
            verification.profileId,
            {
                isVerified: false,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Profile verification deleted successfully",
        });

    } catch (error: any) {
        console.error(
            "Delete verification error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete profile verification",
        });
    }
};