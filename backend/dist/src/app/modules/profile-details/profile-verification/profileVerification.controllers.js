"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVerification = exports.reviewVerification = exports.getVerificationById = exports.getAllVerifications = exports.getMyVerification = exports.submitVerification = void 0;
const profile_model_1 = require("../profile.model");
const profileVerification_model_1 = require("./profileVerification.model");
const profileVerification_interface_1 = require("./profileVerification.interface");
const profileVerification_validation_1 = require("./profileVerification.validation");
const submitVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const authId = req.user.id;
        const files = req.files;
        const selfie = (_a = files === null || files === void 0 ? void 0 : files.selfie) === null || _a === void 0 ? void 0 : _a[0];
        const adhaarFront = (_b = files === null || files === void 0 ? void 0 : files.adhaarFront) === null || _b === void 0 ? void 0 : _b[0];
        //check if selfie not submitted
        if (!selfie) {
            res.status(400).json({
                success: false,
                message: "Selfie is required"
            });
            return;
        }
        //check if adhaar card not submitted
        if (!adhaarFront) {
            res.status(400).json({
                success: false,
                message: "Adhaar document is required"
            });
            return;
        }
        console.log("SELFIE:", selfie);
        console.log("AADHAAR:", adhaarFront);
        //fetch profile by the logged-in user Id
        const profile = yield profile_model_1.Profile.findOne({
            userId: authId
        });
        //check if verification already exists
        const existingVerification = yield profileVerification_model_1.ProfileVerification.findOne({
            profileId: profile === null || profile === void 0 ? void 0 : profile._id
        });
        //check if existing verification request is pending
        if ((existingVerification === null || existingVerification === void 0 ? void 0 : existingVerification.status) === profileVerification_interface_1.VerificationStatus.PENDING) {
            res.status(400).json({
                success: false,
                message: "Your Verification request is already Pending"
            });
            return;
        }
        //check if user profile is already approved
        if ((existingVerification === null || existingVerification === void 0 ? void 0 : existingVerification.status) === profileVerification_interface_1.VerificationStatus.APPROVED) {
            res.status(400).json({
                success: false,
                message: "Your profile is already verified",
            });
            return;
        }
        // Create or update verification
        const verification = yield profileVerification_model_1.ProfileVerification.findOneAndUpdate({
            profileId: profile === null || profile === void 0 ? void 0 : profile._id,
        }, {
            profileId: profile === null || profile === void 0 ? void 0 : profile._id,
            selfieUrl: selfie.path,
            adhaarFrontUrl: adhaarFront.path,
            status: profileVerification_interface_1.VerificationStatus.PENDING,
            rejectionReason: null,
            submittedAt: new Date(),
            reviewedBy: null,
            reviewedAt: null,
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        // Make sure profile is not considered verified
        yield profile_model_1.Profile.findByIdAndUpdate(verification.profileId, {
            isVerified: false,
        });
        return res.status(200).json({
            success: true,
            message: "Profile verification submitted successfully",
            data: verification,
        });
    }
    catch (error) {
        console.error("Submit verification error:", error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to submit profile verification",
        });
    }
});
exports.submitVerification = submitVerification;
const getMyVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authId = req.user.id;
        //fetch profile isVerified filed
        const profile = yield profile_model_1.Profile.findOne({
            userId: authId
        }).select("_id isVerified");
        if (!profile) {
            return res.status(400).json({
                success: false,
                message: "Profile not found!"
            });
        }
        //fetch user's verification
        const verification = yield profileVerification_model_1.ProfileVerification.findOne({
            profileId: profile._id
        });
        return res.status(200).json({
            success: true,
            message: "Profile verification fetched successfully",
            data: {
                isVerified: profile.isVerified,
                verification
            }
        });
    }
    catch (error) {
        console.error("Get my verification error:", error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch profile verification",
        });
    }
});
exports.getMyVerification = getMyVerification;
const getAllVerifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) {
            filter.status = status;
        }
        const verifications = yield profileVerification_model_1.ProfileVerification.find(filter)
            .populate({
            path: "profileId",
            select: "basicDetails.firstName basicDetails.lastName photos matrimonyId userId"
        })
            .populate({
            path: "reviewedBy",
            select: "email role"
        })
            .sort({
            createdBy: -1
        });
        return res.status(200).json({
            success: true,
            message: "Profile verifications fetched successfully",
            data: verifications
        });
    }
    catch (error) {
        console.error("Get all verifications error:", error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch profile verifications",
        });
    }
});
exports.getAllVerifications = getAllVerifications;
const getVerificationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = profileVerification_validation_1.verificationIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification ID",
            });
        }
        const { id } = validation.data;
        const verification = yield profileVerification_model_1.ProfileVerification.findById(id)
            .populate({
            path: "profileId",
            select: "basicDetails.firstName basicDetails.lastName photos matrimonyId userId"
        })
            .populate({
            path: "reviewedBy",
            select: "email role"
        })
            .sort({
            createdBy: -1
        });
        if (!verification) {
            return res.status(404).json({
                success: false,
                message: "Profile verification not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Profile verification fetched successfully",
            data: verification,
        });
    }
    catch (error) {
        console.error("Get verification by ID error:", error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch profile verification",
        });
    }
});
exports.getVerificationById = getVerificationById;
const reviewVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate ID
        const idValidation = profileVerification_validation_1.verificationIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification ID",
            });
        }
        // Validate request body
        const bodyValidation = profileVerification_validation_1.reviewVerificationSchema.safeParse(req.body);
        if (!bodyValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: bodyValidation.error.flatten(),
            });
        }
        const { id } = idValidation.data;
        const { status, rejectionReason } = bodyValidation.data;
        const adminId = req.user.id;
        // Find verification
        const verification = yield profileVerification_model_1.ProfileVerification.findById(id);
        if (!verification) {
            return res.status(404).json({
                success: false,
                message: "Profile verification not found",
            });
        }
        // Prevent reviewing an already approved request
        if (verification.status === profileVerification_interface_1.VerificationStatus.APPROVED) {
            return res.status(400).json({
                success: false,
                message: "This profile is already verified",
            });
        }
        // Update verification
        verification.status = status;
        verification.reviewedBy = adminId;
        verification.reviewedAt = new Date();
        if (status === profileVerification_interface_1.VerificationStatus.REJECTED) {
            verification.rejectionReason = rejectionReason;
        }
        else {
            verification.rejectionReason = null;
        }
        yield verification.save();
        // Update Profile verification status
        yield profile_model_1.Profile.findByIdAndUpdate(verification.profileId, {
            isVerified: true,
        });
        return res.status(200).json({
            success: true,
            message: status === profileVerification_interface_1.VerificationStatus.APPROVED
                ? "Profile verified successfully"
                : "Profile verification rejected successfully",
            data: verification,
        });
    }
    catch (error) {
        console.error("Review verification error:", error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to review profile verification",
        });
    }
});
exports.reviewVerification = reviewVerification;
const deleteVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = profileVerification_validation_1.verificationIdSchema.safeParse(req.params);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification ID",
            });
        }
        const { id } = validation.data;
        const verification = yield profileVerification_model_1.ProfileVerification.findById(id);
        if (!verification) {
            return res.status(404).json({
                success: false,
                message: "Profile verification not found",
            });
        }
        yield profileVerification_model_1.ProfileVerification.findByIdAndDelete(id);
        // Make sure profile is not considered verified
        yield profile_model_1.Profile.findByIdAndUpdate(verification.profileId, {
            isVerified: false,
        });
        return res.status(200).json({
            success: true,
            message: "Profile verification deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete verification error:", error);
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to delete profile verification",
        });
    }
});
exports.deleteVerification = deleteVerification;
