import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid ID',
  });

export const createAppReviewSchema = z.object({
  rating: z
    .number('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),

  review: z
    .string('Review is required')
    .trim()
    .min(3, 'Review must be at least 3 characters')
    .max(1000, 'Review cannot exceed 1000 characters'),
});

export const appReviewIdSchema = z.object({
  id: objectIdSchema,
});
