import { z } from 'zod';

// Schema for a single onboarding item
export const onboardingSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().trim().optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

// Used when adding a new onboarding item (image comes via multipart upload, not body)
export const createOnboardingItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export const onboardingItemIdSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
});

export const onboardingArrSchema = z.object({
  content: z
    .array(onboardingSchema)
    .min(1, 'Content must contain at least 1 onboarding item'),
  createdAt: z.coerce.date().optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type OnboardingArrInput = z.infer<typeof onboardingArrSchema>;
