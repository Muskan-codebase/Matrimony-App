"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBannerSchema = exports.createBannerSchema = void 0;
const zod_1 = require("zod");
exports.createBannerSchema = zod_1.z.object({
    image: zod_1.z
        .string()
        .trim()
        .min(1, "Image is required.")
        .url("Image must be a valid URL."),
    badge: zod_1.z
        .string()
        .trim()
        .min(1, "Badge is required.")
        .max(100, "Badge cannot exceed 100 characters."),
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required.")
        .max(200, "Title cannot exceed 200 characters."),
    description: zod_1.z
        .string()
        .trim()
        .min(1, "Description is required.")
        .max(500, "Description cannot exceed 500 characters."),
    displayOrder: zod_1.z
        .number()
        .int("Display order must be an integer.")
        .min(1, "Display order must be at least 1.")
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
});
exports.updateBannerSchema = zod_1.z.object({
    image: zod_1.z
        .string()
        .trim()
        .url("Image must be a valid URL.")
        .optional(),
    badge: zod_1.z
        .string()
        .trim()
        .min(1, "Badge cannot be empty.")
        .max(100, "Badge cannot exceed 100 characters.")
        .optional(),
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title cannot be empty.")
        .max(200, "Title cannot exceed 200 characters.")
        .optional(),
    description: zod_1.z
        .string()
        .trim()
        .min(1, "Description cannot be empty.")
        .max(500, "Description cannot exceed 500 characters.")
        .optional(),
    displayOrder: zod_1.z
        .number()
        .int("Display order must be an integer.")
        .min(1, "Display order must be at least 1.")
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
});
