"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privacyPolicySchema = void 0;
const zod_1 = require("zod");
exports.privacyPolicySchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required"),
    content: zod_1.z
        .string()
        .trim()
        .min(1, "Privacy Policy content is required"),
});
