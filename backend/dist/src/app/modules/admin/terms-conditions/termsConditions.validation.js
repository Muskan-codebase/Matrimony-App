"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.termsConditionsSchema = void 0;
const zod_1 = require("zod");
exports.termsConditionsSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required"),
    content: zod_1.z
        .string()
        .trim()
        .min(1, "Content is required"),
});
