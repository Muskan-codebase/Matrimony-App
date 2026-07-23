"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardingArrSchema = exports.onboardingSchema = void 0;
const zod_1 = require("zod");
// Schema for a single onboarding item
exports.onboardingSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    image: zod_1.z.string().trim().optional(),
    status: zod_1.z.enum(['Active', 'Inactive']).default('Active'),
});
exports.onboardingArrSchema = zod_1.z.object({
    content: zod_1.z
        .array(exports.onboardingSchema)
        .length(3, 'Content must contain exactly 3 onboarding items'),
    createdAt: zod_1.z.coerce.date().optional(),
});
