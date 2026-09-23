import { z } from 'zod';

export const createSuccessStorySchema = z.object({
  groomName: z.string().trim().min(1, 'Groom name is required.'),

  brideName: z.string().trim().min(1, 'Bride name is required.'),

  badge: z.string().trim().optional(),

  marriedDate: z.coerce.date({
    error: () => ({ message: 'Married date must be a valid date.' }),
  }),

  location: z.string().trim().min(1, 'Location is required.'),

  story: z.string().trim(),
  year: z.number().int(),

  image: z.string().url(),

  isActive: z.boolean().optional(),
});

export const updateSuccessStorySchema = createSuccessStorySchema.partial();
