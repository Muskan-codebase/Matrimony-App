"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVerificationQuerySchema = exports.verificationIdSchema = exports.reviewVerificationSchema = exports.submitVerificationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const profileVerification_interface_1 = require("./profileVerification.interface");
const objectIdSchema = zod_1.z.string().refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), {
    message: "Invalid ID",
});
exports.submitVerificationSchema = zod_1.z.object({});
exports.reviewVerificationSchema = zod_1.z
    .object({
    status: zod_1.z.enum([
        profileVerification_interface_1.VerificationStatus.APPROVED,
        profileVerification_interface_1.VerificationStatus.REJECTED,
    ]),
    rejectionReason: zod_1.z
        .string()
        .trim()
        .min(3, "Rejection reason must be at least 3 characters")
        .max(500, "Rejection reason cannot exceed 500 characters")
        .optional(),
})
    .superRefine((data, ctx) => {
    if (data.status === profileVerification_interface_1.VerificationStatus.REJECTED &&
        !data.rejectionReason) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["rejectionReason"],
            message: "Rejection reason is required",
        });
    }
    if (data.status === profileVerification_interface_1.VerificationStatus.APPROVED &&
        data.rejectionReason) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["rejectionReason"],
            message: "Rejection reason is not allowed",
        });
    }
});
exports.verificationIdSchema = zod_1.z.object({
    id: objectIdSchema,
});
exports.getVerificationQuerySchema = zod_1.z.object({
    status: zod_1.z
        .enum([
        profileVerification_interface_1.VerificationStatus.PENDING,
        profileVerification_interface_1.VerificationStatus.APPROVED,
        profileVerification_interface_1.VerificationStatus.REJECTED,
    ])
        .optional(),
});
