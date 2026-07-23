"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockIdSchema = exports.createBlockSchema = void 0;
const zod_1 = require("zod");
exports.createBlockSchema = zod_1.z.object({
    blockedUserId: zod_1.z.string().min(1, "Blocked User ID is required"),
});
exports.blockIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Block ID is required"),
});
