import { z } from "zod";
import { ReportReason } from "../../../enums/report-reason.enum";

export const reportProfileSchema = z.object({
    reason: z.enum([
        ReportReason.ASKING_FOR_MONEY,
        ReportReason.ALREADY_ENGAGED_OR_MARRIED,
        ReportReason.NO_INTENTION_TO_MARRY,
        ReportReason.ABUSIVE_OR_INDECENT_LANGUAGE,
        ReportReason.PHOTO_DOES_NOT_BELONG_TO_PERSON,
        ReportReason.FAKE_OR_INCORRECT_INFORMATION,
        ReportReason.STALKING,
    ]),
});

export const profileIdParamSchema = z.object({
    profileId: z.string().min(1, "Profile ID is required"),
});

export const reportIdParamSchema = z.object({
    reportId: z.string().min(1, "Report ID is required"),
});

export const adminReportActionSchema = z.object({
    adminNote: z
        .string()
        .trim()
        .max(500, "Admin note cannot exceed 500 characters")
        .optional(),
});