"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortlistIdSchema = exports.createShortlistSchema = void 0;
const zod_1 = require("zod");
exports.createShortlistSchema = zod_1.z.object({
    shortlistedUserId: zod_1.z.string().min(1, "Shortlisted User ID is required"),
});
exports.shortlistIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Shortlist ID is required"),
});
