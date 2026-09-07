import { z } from "zod";

export const createHelpCentreSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required"),

    description: z
        .string()
        .trim()
        .optional(),

    icon: z
        .string()
        .trim()
        .optional(),

    displayOrder: z
        .number()
        .int()
        .min(0)
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});

export const updateHelpCentreSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),

    icon: z
        .string()
        .trim()
        .optional(),

    displayOrder: z
        .number()
        .int()
        .min(0)
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});