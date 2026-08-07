"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileVerification = void 0;
const mongoose_1 = require("mongoose");
const profileVerification_interface_1 = require("./profileVerification.interface");
const profileVerificationSchema = new mongoose_1.Schema({
    profileId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
        unique: true,
        index: true,
    },
    selfieUrl: {
        type: String,
        required: true,
        trim: true,
    },
    adhaarFrontUrl: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(profileVerification_interface_1.VerificationStatus),
        default: profileVerification_interface_1.VerificationStatus.PENDING,
        required: true,
        index: true,
    },
    rejectionReason: {
        type: String,
        trim: true,
        default: null,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    reviewedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Auth",
        default: null,
    },
    reviewedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
exports.ProfileVerification = (0, mongoose_1.model)("ProfileVerification", profileVerificationSchema);
