"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCasteSchema = exports.createCasteSchema = void 0;
const zod_1 = require("zod");
exports.createCasteSchema = zod_1.z.object({
    body: zod_1.z.object({
        religionId: zod_1.z.string(),
        caste: zod_1.z.string().min(1),
    }),
});
exports.updateCasteSchema = zod_1.z.object({
    body: zod_1.z.object({
        religionId: zod_1.z.string().optional(),
        caste: zod_1.z.string().min(1).optional(),
    }),
});
