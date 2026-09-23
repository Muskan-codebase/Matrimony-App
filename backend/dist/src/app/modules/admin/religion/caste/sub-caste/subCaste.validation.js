"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubCasteSchema = exports.createSubCasteSchema = void 0;
const zod_1 = require("zod");
exports.createSubCasteSchema = zod_1.z.object({
    body: zod_1.z.object({
        religionId: zod_1.z.string(),
        casteId: zod_1.z.string(),
        subCaste: zod_1.z.string().min(1),
    }),
});
exports.updateSubCasteSchema = zod_1.z.object({
    body: zod_1.z.object({
        religionId: zod_1.z.string().optional(),
        casteId: zod_1.z.string().optional(),
        subCaste: zod_1.z.string().min(1).optional(),
    }),
});
