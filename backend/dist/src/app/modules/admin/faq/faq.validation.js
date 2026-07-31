"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFAQSchema = exports.createFAQSchema = void 0;
const zod_1 = require("zod");
exports.createFAQSchema = zod_1.z.object({
    question: zod_1.z
        .string()
        .trim()
        .min(1, "Question is required.")
        .max(200, "Question cannot exceed 200 characters."),
    answer: zod_1.z
        .string()
        .trim()
        .min(1, "Answer is required.")
        .max(2000, "Answer cannot exceed 2000 characters."),
    displayOrder: zod_1.z
        .number()
        .int()
        .min(1)
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
});
exports.updateFAQSchema = zod_1.z.object({
    question: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(200)
        .optional(),
    answer: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(2000)
        .optional(),
    displayOrder: zod_1.z
        .number()
        .int()
        .min(1)
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
});
