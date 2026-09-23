"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExperienceSchema = exports.createExperienceSchema = void 0;
const zod_1 = require("zod");
exports.createExperienceSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(150, "Title cannot exceed 150 characters"),
    description: zod_1.z
        .string()
        .trim()
        .min(1, "Description is required")
        .max(1000, "Description cannot exceed 1000 characters"),
    icon: zod_1.z
        .string()
        .trim()
        .optional(),
    sortOrder: zod_1.z
        .number()
        .int()
        .min(0)
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
});
exports.updateExperienceSchema = exports.createExperienceSchema.partial();
