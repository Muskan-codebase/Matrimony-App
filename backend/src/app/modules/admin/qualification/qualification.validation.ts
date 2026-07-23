import { z } from "zod";

export const createQualificationSchema = z.object({

    body: z.object({

        qualification: z
            .string()
            .trim()
            .min(1, "Qualification is required."),

        educationType: z
            .string()
            .trim()
            .min(1, "Education type is required."),

        occupation: z
            .string()
            .trim()
            .min(1, "Occupation is required."),

        // annualIncome: z
        //     .string()
        //     .trim()
        //     .min(1, "Annual income is required."),

    }),

});

export const updateQualificationSchema = z.object({

    body: z.object({

        qualification: z
            .string()
            .trim()
            .min(1)
            .optional(),

        educationType: z
            .string()
            .trim()
            .min(1)
            .optional(),

        occupation: z
            .string()
            .trim()
            .min(1)
            .optional(),

        // annualIncome: z
        //     .string()
        //     .trim()
        //     .min(1)
        //     .optional(),

    }),

});