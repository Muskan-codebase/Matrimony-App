import { z } from "zod";

export const createFAQSchema = z.object({
    question: z
        .string()
        .trim()
        .min(1, "Question is required.")
        .max(200, "Question cannot exceed 200 characters."),

    answer: z
        .string()
        .trim()
        .min(1, "Answer is required.")
        .max(2000, "Answer cannot exceed 2000 characters."),

    displayOrder: z
        .number()
        .int()
        .min(1)
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});

export const updateFAQSchema = z.object({
    question: z
        .string()
        .trim()
        .min(1)
        .max(200)
        .optional(),

    answer: z
        .string()
        .trim()
        .min(1)
        .max(2000)
        .optional(),

    displayOrder: z
        .number()
        .int()
        .min(1)
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});