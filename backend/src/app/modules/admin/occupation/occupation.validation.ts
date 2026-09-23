import { z } from "zod";

export const createOccupationSchema = z.object({
    body: z.object({
        occupation: z
            .string()
            .trim()
            .min(2, "Occupation is required.")
            .max(100),
    }),
});