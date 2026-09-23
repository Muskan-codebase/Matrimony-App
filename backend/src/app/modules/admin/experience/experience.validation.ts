import { z } from "zod";

export const createExperienceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description cannot exceed 1000 characters"),

  icon: z
    .string()
    .trim()
    .optional(),

  sortOrder: z
    .number()
    .int()
    .min(0)
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export const updateExperienceSchema =
  createExperienceSchema.partial();