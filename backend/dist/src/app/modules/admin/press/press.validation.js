"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePressSchema = exports.createPressSchema = void 0;
const zod_1 = require("zod");
exports.createPressSchema = zod_1.z.object({
    publication: zod_1.z
        .string()
        .trim()
        .min(1, "Publication name is required"),
    date: zod_1.z
        .string()
        .trim()
        .min(1, "Date is required"),
    image: zod_1.z
        .string()
        .trim()
        .min(1, "Image is required"),
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required"),
    description: zod_1.z
        .string()
        .trim()
        .min(1, "Description is required"),
    articleUrl: zod_1.z
        .string()
        .trim()
        .url("Please enter a valid article URL"),
});
exports.updatePressSchema = zod_1.z.object({
    publication: zod_1.z
        .string()
        .trim()
        .min(1, "Publication name is required")
        .optional(),
    date: zod_1.z
        .string()
        .trim()
        .min(1, "Date is required")
        .optional(),
    image: zod_1.z
        .string()
        .trim()
        .min(1, "Image is required")
        .optional(),
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required")
        .optional(),
    description: zod_1.z
        .string()
        .trim()
        .min(1, "Description is required")
        .optional(),
    articleUrl: zod_1.z
        .string()
        .trim()
        .url("Please enter a valid article URL")
        .optional(),
});
