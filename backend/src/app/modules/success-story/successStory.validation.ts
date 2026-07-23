import { z } from "zod";

export const createSuccessStorySchema = z.object({

    groomName: z.string().min(1),

    brideName: z.string().min(1),

    story: z.string().min(10),

    year: z.number(),

    image: z.string().url(),

});

export const updateSuccessStorySchema =
createSuccessStorySchema.partial();