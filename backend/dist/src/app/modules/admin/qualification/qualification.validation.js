"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQualificationSchema = exports.createQualificationSchema = void 0;
const zod_1 = require("zod");
exports.createQualificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        qualification: zod_1.z
            .string()
            .trim()
            .min(1, "Qualification is required."),
        educationType: zod_1.z
            .string()
            .trim()
            .min(1, "Education type is required."),
        occupation: zod_1.z
            .string()
            .trim()
            .min(1, "Occupation is required."),
        // annualIncome: z
        //     .string()
        //     .trim()
        //     .min(1, "Annual income is required."),
    }),
});
exports.updateQualificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        qualification: zod_1.z
            .string()
            .trim()
            .min(1)
            .optional(),
        educationType: zod_1.z
            .string()
            .trim()
            .min(1)
            .optional(),
        occupation: zod_1.z
            .string()
            .trim()
            .min(1)
            .optional(),
        // annualIncome: z
        //     .string()
        //     .trim()
        //     .min(1)
        //     .optional(),
    }),
});
