"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUsSchema = void 0;
const zod_1 = require("zod");
exports.contactUsSchema = zod_1.z.object({
    officeAddress: zod_1.z
        .string()
        .trim()
        .min(1, "Office address is required"),
    email: zod_1.z
        .string()
        .trim()
        .email("Please enter a valid email address"),
});
