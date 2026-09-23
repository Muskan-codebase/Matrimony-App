"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnnualIncomeValidation = exports.createAnnualIncomeValidation = void 0;
const zod_1 = require("zod");
exports.createAnnualIncomeValidation = zod_1.z.object({
    body: zod_1.z.object({
        annualIncome: zod_1.z.string().trim().min(1),
        minIncome: zod_1.z.number().nonnegative(),
        maxIncome: zod_1.z.number().nonnegative().nullable(),
    }),
});
exports.updateAnnualIncomeValidation = zod_1.z.object({
    body: zod_1.z.object({
        annualIncome: zod_1.z.string().trim().min(1).optional(),
        minIncome: zod_1.z.number().nonnegative().optional(),
        maxIncome: zod_1.z.number().nonnegative().nullable().optional(),
    }),
});
