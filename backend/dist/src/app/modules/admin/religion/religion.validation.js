"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReligionSchema = exports.createReligionSchema = void 0;
const zod_1 = require("zod");
exports.createReligionSchema = zod_1.z.object({
    body: zod_1.z.object({
        religion: zod_1.z
            .string()
            .trim()
            .min(2, "Religion is required"),
    }),
});
exports.updateReligionSchema = zod_1.z.object({
    body: zod_1.z.object({
        religion: zod_1.z
            .string()
            .trim()
            .min(2)
            .optional(),
    }),
});
