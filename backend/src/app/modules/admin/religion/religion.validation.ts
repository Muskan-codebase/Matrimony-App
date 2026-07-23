import { z } from "zod";

export const createReligionSchema = z.object({
    body: z.object({
        religion: z
            .string()
            .trim()
            .min(2, "Religion is required"),
    }),
});

export const updateReligionSchema = z.object({
    body: z.object({
        religion: z
            .string()
            .trim()
            .min(2)
            .optional(),
    }),
});

export type CreateReligionInput = z.infer<typeof createReligionSchema>;
export type UpdateReligionInput = z.infer<typeof updateReligionSchema>;