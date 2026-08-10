"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminReportActionSchema = exports.reportIdParamSchema = exports.profileIdParamSchema = exports.reportProfileSchema = void 0;
const zod_1 = require("zod");
const report_reason_enum_1 = require("../../../enums/report-reason.enum");
exports.reportProfileSchema = zod_1.z.object({
    reason: zod_1.z.enum([
        report_reason_enum_1.ReportReason.ASKING_FOR_MONEY,
        report_reason_enum_1.ReportReason.ALREADY_ENGAGED_OR_MARRIED,
        report_reason_enum_1.ReportReason.NO_INTENTION_TO_MARRY,
        report_reason_enum_1.ReportReason.ABUSIVE_OR_INDECENT_LANGUAGE,
        report_reason_enum_1.ReportReason.PHOTO_DOES_NOT_BELONG_TO_PERSON,
        report_reason_enum_1.ReportReason.FAKE_OR_INCORRECT_INFORMATION,
        report_reason_enum_1.ReportReason.STALKING,
    ]),
});
exports.profileIdParamSchema = zod_1.z.object({
    profileId: zod_1.z.string().min(1, "Profile ID is required"),
});
exports.reportIdParamSchema = zod_1.z.object({
    reportId: zod_1.z.string().min(1, "Report ID is required"),
});
exports.adminReportActionSchema = zod_1.z.object({
    adminNote: zod_1.z
        .string()
        .trim()
        .max(500, "Admin note cannot exceed 500 characters")
        .optional(),
});
