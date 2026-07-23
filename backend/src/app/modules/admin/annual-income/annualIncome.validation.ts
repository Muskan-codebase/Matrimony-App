import { z } from "zod";

export const createAnnualIncomeValidation = z.object({
    body: z.object({
        annualIncome: z.string().trim().min(1),

        minIncome: z.number().nonnegative(),

        maxIncome: z.number().nonnegative().nullable(),
    }),
});

export const updateAnnualIncomeValidation = z.object({
    body: z.object({
        annualIncome: z.string().trim().min(1).optional(),

        minIncome: z.number().nonnegative().optional(),

        maxIncome: z.number().nonnegative().nullable().optional(),
    }),
});