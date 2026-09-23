import { z } from "zod";

export const createCasteSchema = z.object({

    body: z.object({

        religionId: z.string(),

        caste: z.string().min(1),

    }),

});

export const updateCasteSchema = z.object({

    body: z.object({

        religionId: z.string().optional(),

        caste: z.string().min(1).optional(),

    }),

});