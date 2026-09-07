"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHelpCentreSchema = exports.createHelpCentreSchema = void 0;
const zod_1 = require("zod");
exports.createHelpCentreSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required"),
    description: zod_1.z
        .string()
        .trim()
        .optional(),
    icon: zod_1.z
        .string()
        .trim()
        .optional(),
    displayOrder: zod_1.z
        .number()
        .int()
        .min(0)
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
});
exports.updateHelpCentreSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .optional(),
    description: zod_1.z
        .string()
        .trim()
        .optional(),
    icon: zod_1.z
        .string()
        .trim()
        .optional(),
    displayOrder: zod_1.z
        .number()
        .int()
        .min(0)
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
});
