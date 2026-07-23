import { z } from "zod";

export const createSubCasteSchema = z.object({

    body: z.object({

        religionId: z.string(),

        casteId: z.string(),

        subCaste: z.string().min(1),

    }),

});

export const updateSubCasteSchema = z.object({

    body: z.object({

        religionId: z.string().optional(),

        casteId: z.string().optional(),

        subCaste: z.string().min(1).optional(),

    }),

});