import { z } from "zod";

export const createPressSchema = z.object({
    publication: z
        .string()
        .trim()
        .min(1, "Publication name is required"),

    date: z
        .string()
        .trim()
        .min(1, "Date is required"),

    image: z
        .string()
        .trim()
        .min(1, "Image is required"),

    title: z
        .string()
        .trim()
        .min(1, "Title is required"),

    description: z
        .string()
        .trim()
        .min(1, "Description is required"),

    articleUrl: z
        .string()
        .trim()
        .url("Please enter a valid article URL"),
});

export const updatePressSchema = z.object({
    publication: z
        .string()
        .trim()
        .min(1, "Publication name is required")
        .optional(),

    date: z
        .string()
        .trim()
        .min(1, "Date is required")
        .optional(),

    image: z
        .string()
        .trim()
        .min(1, "Image is required")
        .optional(),

    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .optional(),

    description: z
        .string()
        .trim()
        .min(1, "Description is required")
        .optional(),

    articleUrl: z
        .string()
        .trim()
        .url("Please enter a valid article URL")
        .optional(),
});