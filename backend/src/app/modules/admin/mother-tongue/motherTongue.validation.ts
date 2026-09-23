import { z } from "zod";

export const createMotherTongueSchema = z.object({

    body: z.object({

        motherTongue: z
            .string()
            .trim()
            .min(1, "Mother tongue is required"),

    }),

});

export const updateMotherTongueSchema = z.object({

    body: z.object({

        motherTongue: z
            .string()
            .trim()
            .min(1, "Mother tongue is required")
            .optional(),

    }),

});