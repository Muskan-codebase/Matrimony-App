import { z } from 'zod';

// Schema for a single onboarding item
export const onboardingSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().trim().optional(),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export const onboardingArrSchema = z.object({
  content: z
    .array(onboardingSchema)
    .length(3, 'Content must contain exactly 3 onboarding items'),
  createdAt: z.coerce.date().optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type OnboardingArrInput = z.infer<typeof onboardingArrSchema>;
