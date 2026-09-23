"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOccupationSchema = void 0;
const zod_1 = require("zod");
exports.createOccupationSchema = zod_1.z.object({
    body: zod_1.z.object({
        occupation: zod_1.z
            .string()
            .trim()
            .min(2, "Occupation is required.")
            .max(100),
    }),
});
