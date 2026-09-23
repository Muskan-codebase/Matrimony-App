"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreIdSchema = exports.createIgnoreSchema = void 0;
const zod_1 = require("zod");
exports.createIgnoreSchema = zod_1.z.object({
    ignoredUserId: zod_1.z.string().min(1, "Ignored User ID is required"),
});
exports.ignoreIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Ignore ID is required"),
});
