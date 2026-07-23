"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHeightSchema = exports.createHeightSchema = void 0;
const zod_1 = require("zod");
exports.createHeightSchema = zod_1.z.object({
    body: zod_1.z.object({
        height: zod_1.z
            .string()
            .trim()
            .min(1, "Height is required."),
    }),
});
exports.updateHeightSchema = zod_1.z.object({
    body: zod_1.z.object({
        height: zod_1.z
            .string()
            .trim()
            .min(1)
            .optional(),
    }),
});
