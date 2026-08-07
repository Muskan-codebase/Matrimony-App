import { z } from "zod";
import mongoose from "mongoose";
import { VerificationStatus } from "./profileVerification.interface";

const objectIdSchema = z.string().refine(
    (value) => mongoose.Types.ObjectId.isValid(value),
    {
        message: "Invalid ID",
    }
);

export const submitVerificationSchema = z.object({});

export const reviewVerificationSchema = z
    .object({
        status: z.enum([
            VerificationStatus.APPROVED,
            VerificationStatus.REJECTED,
        ]),

        rejectionReason: z
            .string()
            .trim()
            .min(3, "Rejection reason must be at least 3 characters")
            .max(500, "Rejection reason cannot exceed 500 characters")
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.status === VerificationStatus.REJECTED &&
            !data.rejectionReason
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["rejectionReason"],
                message: "Rejection reason is required",
            });
        }

        if (
            data.status === VerificationStatus.APPROVED &&
            data.rejectionReason
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["rejectionReason"],
                message: "Rejection reason is not allowed",
            });
        }
    });

export const verificationIdSchema = z.object({
    id: objectIdSchema,
});

export const getVerificationQuerySchema = z.object({
    status: z
        .enum([
            VerificationStatus.PENDING,
            VerificationStatus.APPROVED,
            VerificationStatus.REJECTED,
        ])
        .optional(),
});