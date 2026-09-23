"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSuccessStorySchema = exports.createSuccessStorySchema = void 0;
const zod_1 = require("zod");
exports.createSuccessStorySchema = zod_1.z.object({
    groomName: zod_1.z.string().trim().min(1, 'Groom name is required.'),
    brideName: zod_1.z.string().trim().min(1, 'Bride name is required.'),
    badge: zod_1.z.string().trim().optional(),
    marriedDate: zod_1.z.coerce.date({
        error: () => ({ message: 'Married date must be a valid date.' }),
    }),
    location: zod_1.z.string().trim().min(1, 'Location is required.'),
    story: zod_1.z.string().trim(),
    year: zod_1.z.number().int(),
    image: zod_1.z.string().url(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateSuccessStorySchema = exports.createSuccessStorySchema.partial();
