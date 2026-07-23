"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSuccessStorySchema = exports.createSuccessStorySchema = void 0;
const zod_1 = require("zod");
exports.createSuccessStorySchema = zod_1.z.object({
    groomName: zod_1.z.string().min(1),
    brideName: zod_1.z.string().min(1),
    story: zod_1.z.string().min(10),
    year: zod_1.z.number(),
    image: zod_1.z.string().url(),
});
exports.updateSuccessStorySchema = exports.createSuccessStorySchema.partial();
