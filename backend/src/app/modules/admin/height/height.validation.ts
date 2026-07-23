import { z } from "zod";

export const createHeightSchema = z.object({

    body: z.object({

        height: z
            .string()
            .trim()
            .min(1, "Height is required."),

    }),

});

export const updateHeightSchema = z.object({

    body: z.object({

        height: z
            .string()
            .trim()
            .min(1)
            .optional(),

    }),

});