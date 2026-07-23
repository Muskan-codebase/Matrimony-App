"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMotherTongueSchema = exports.createMotherTongueSchema = void 0;
const zod_1 = require("zod");
exports.createMotherTongueSchema = zod_1.z.object({
    body: zod_1.z.object({
        motherTongue: zod_1.z
            .string()
            .trim()
            .min(1, "Mother tongue is required"),
    }),
});
exports.updateMotherTongueSchema = zod_1.z.object({
    body: zod_1.z.object({
        motherTongue: zod_1.z
            .string()
            .trim()
            .min(1, "Mother tongue is required")
            .optional(),
    }),
});
