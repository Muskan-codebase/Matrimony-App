"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOnlinePersonalTipSchema = exports.createOnlinePersonalTipSchema = void 0;
const zod_1 = require("zod");
const tips_interface_1 = require("./tips.interface");
// Create Schema
exports.createOnlinePersonalTipSchema = zod_1.z.object({
    category: zod_1.z.enum(tips_interface_1.PERSONAL_TIP_CATEGORIES, {
        error: `Category must be one of: ${tips_interface_1.PERSONAL_TIP_CATEGORIES.join(', ')}`,
    }),
    image: zod_1.z
        .string()
        .trim()
        .min(1, 'Image is required.')
        .url('Image must be a valid URL.'),
    title: zod_1.z
        .string()
        .trim()
        .min(1, 'Title is required.')
        .max(200, 'Title cannot exceed 200 characters.'),
    subTitle: zod_1.z
        .string()
        .trim()
        .min(1, 'Sub-title is required.')
        .max(200, 'Sub-title cannot exceed 200 characters.'),
    displayOrder: zod_1.z
        .number()
        .int('Display order must be an integer.')
        .min(1, 'Display order must be at least 1.')
        .optional(),
    isActive: zod_1.z.boolean().optional(),
});
// Update Schema
exports.updateOnlinePersonalTipSchema = zod_1.z.object({
    category: zod_1.z
        .enum(tips_interface_1.PERSONAL_TIP_CATEGORIES, {
        error: `Category must be one of: ${tips_interface_1.PERSONAL_TIP_CATEGORIES.join(', ')}`,
    })
        .optional(),
    image: zod_1.z.string().trim().url('Image must be a valid URL.').optional(),
    title: zod_1.z
        .string()
        .trim()
        .min(1, 'Title cannot be empty.')
        .max(200, 'Title cannot exceed 200 characters.')
        .optional(),
    subTitle: zod_1.z
        .string()
        .trim()
        .min(1, 'Sub-title cannot be empty.')
        .max(200, 'Sub-title cannot exceed 200 characters.')
        .optional(),
    displayOrder: zod_1.z
        .number()
        .int('Display order must be an integer.')
        .min(1, 'Display order must be at least 1.')
        .optional(),
    isActive: zod_1.z.boolean().optional(),
});
