import { z } from 'zod';
import { PERSONAL_TIP_CATEGORIES } from './tips.interface';

// Create Schema
export const createOnlinePersonalTipSchema = z.object({
  category: z.enum(PERSONAL_TIP_CATEGORIES, {
    error: `Category must be one of: ${PERSONAL_TIP_CATEGORIES.join(', ')}`,
  }),

  image: z
    .string()
    .trim()
    .min(1, 'Image is required.')
    .url('Image must be a valid URL.'),

  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(200, 'Title cannot exceed 200 characters.'),

  subTitle: z
    .string()
    .trim()
    .min(1, 'Sub-title is required.')
    .max(200, 'Sub-title cannot exceed 200 characters.'),

  displayOrder: z
    .number()
    .int('Display order must be an integer.')
    .min(1, 'Display order must be at least 1.')
    .optional(),

  isActive: z.boolean().optional(),
});

// Update Schema
export const updateOnlinePersonalTipSchema = z.object({
  category: z
    .enum(PERSONAL_TIP_CATEGORIES, {
      error: `Category must be one of: ${PERSONAL_TIP_CATEGORIES.join(', ')}`,
    })
    .optional(),

  image: z.string().trim().url('Image must be a valid URL.').optional(),

  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty.')
    .max(200, 'Title cannot exceed 200 characters.')
    .optional(),

  subTitle: z
    .string()
    .trim()
    .min(1, 'Sub-title cannot be empty.')
    .max(200, 'Sub-title cannot exceed 200 characters.')
    .optional(),

  displayOrder: z
    .number()
    .int('Display order must be an integer.')
    .min(1, 'Display order must be at least 1.')
    .optional(),

  isActive: z.boolean().optional(),
});
