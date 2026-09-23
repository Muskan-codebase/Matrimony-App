"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardingArrSchema = exports.onboardingItemIdSchema = exports.createOnboardingItemSchema = exports.onboardingSchema = void 0;
const zod_1 = require("zod");
// Schema for a single onboarding item
exports.onboardingSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    image: zod_1.z.string().trim().optional(),
    status: zod_1.z.enum(['Active', 'Inactive']).default('Active'),
});
// Used when adding a new onboarding item (image comes via multipart upload, not body)
exports.createOnboardingItemSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    status: zod_1.z.enum(['Active', 'Inactive']).default('Active'),
});
exports.onboardingItemIdSchema = zod_1.z.object({
    itemId: zod_1.z.string().min(1, 'Item ID is required'),
});
exports.onboardingArrSchema = zod_1.z.object({
    content: zod_1.z
        .array(exports.onboardingSchema)
        .min(1, 'Content must contain at least 1 onboarding item'),
    createdAt: zod_1.z.coerce.date().optional(),
});
