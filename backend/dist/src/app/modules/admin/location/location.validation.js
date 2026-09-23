"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocationSchema = exports.createLocationSchema = void 0;
const zod_1 = require("zod");
exports.createLocationSchema = zod_1.z.object({
    body: zod_1.z.object({
        country: zod_1.z
            .string()
            .trim()
            .min(1, "Country is required."),
        state: zod_1.z
            .string()
            .trim()
            .min(1, "State is required."),
        city: zod_1.z
            .string()
            .trim()
            .min(1, "City is required."),
    }),
});
exports.updateLocationSchema = zod_1.z.object({
    body: zod_1.z.object({
        country: zod_1.z
            .string()
            .trim()
            .min(1)
            .optional(),
        state: zod_1.z
            .string()
            .trim()
            .min(1)
            .optional(),
        city: zod_1.z
            .string()
            .trim()
            .min(1)
            .optional(),
    }),
});
