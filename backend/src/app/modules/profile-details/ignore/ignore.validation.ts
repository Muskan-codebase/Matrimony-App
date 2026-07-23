import { z } from "zod";

export const createIgnoreSchema = z.object({
    ignoredUserId: z.string().min(1, "Ignored User ID is required"),
});

export const ignoreIdSchema = z.object({
    id: z.string().min(1, "Ignore ID is required"),
});