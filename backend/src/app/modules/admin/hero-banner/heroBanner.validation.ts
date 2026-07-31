import { z } from "zod";

export const createBannerSchema = z.object({
    image: z
        .string()
        .trim()
        .min(1, "Image is required.")
        .url("Image must be a valid URL."),

    badge: z
        .string()
        .trim()
        .min(1, "Badge is required.")
        .max(100, "Badge cannot exceed 100 characters."),

    title: z
        .string()
        .trim()
        .min(1, "Title is required.")
        .max(200, "Title cannot exceed 200 characters."),

    description: z
        .string()
        .trim()
        .min(1, "Description is required.")
        .max(500, "Description cannot exceed 500 characters."),

    displayOrder: z
        .number()
        .int("Display order must be an integer.")
        .min(1, "Display order must be at least 1.")
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});

export const updateBannerSchema = z.object({
    image: z
        .string()
        .trim()
        .url("Image must be a valid URL.")
        .optional(),

    badge: z
        .string()
        .trim()
        .min(1, "Badge cannot be empty.")
        .max(100, "Badge cannot exceed 100 characters.")
        .optional(),

    title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty.")
        .max(200, "Title cannot exceed 200 characters.")
        .optional(),

    description: z
        .string()
        .trim()
        .min(1, "Description cannot be empty.")
        .max(500, "Description cannot exceed 500 characters.")
        .optional(),

    displayOrder: z
        .number()
        .int("Display order must be an integer.")
        .min(1, "Display order must be at least 1.")
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});