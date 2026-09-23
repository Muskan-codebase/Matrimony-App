"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fraudAlertSchema = void 0;
const zod_1 = require("zod");
exports.fraudAlertSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required"),
    content: zod_1.z
        .string()
        .trim()
        .min(1, "Content is required"),
    isActive: zod_1.z
        .boolean()
        .optional(),
});
