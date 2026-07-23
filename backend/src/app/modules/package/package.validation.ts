import { z } from "zod";

export const createPackageSchema = z.object({

    title: z.string().min(1),

    description: z.string().min(1),

    duration: z.number().positive(),

    durationType: z.enum([
        "DAY",
        "MONTH",
        "YEAR",
    ]),

    price: z.number().positive(),

    originalPrice: z.number().optional(),

    discountPercentage: z.number().optional(),

    badge: z.string().optional(),

    features: z.array(z.string()),

    isDeleted: z.boolean().optional(),

    displayOrder: z.number().optional(),
});

export const updatePackageSchema = createPackageSchema.partial();