import { z } from "zod";

export const createLocationSchema = z.object({

    body: z.object({

        country: z
            .string()
            .trim()
            .min(1, "Country is required."),

        state: z
            .string()
            .trim()
            .min(1, "State is required."),

        city: z
            .string()
            .trim()
            .min(1, "City is required."),

    }),

});

export const updateLocationSchema = z.object({

    body: z.object({

        country: z
            .string()
            .trim()
            .min(1)
            .optional(),

        state: z
            .string()
            .trim()
            .min(1)
            .optional(),

        city: z
            .string()
            .trim()
            .min(1)
            .optional(),

    }),

});