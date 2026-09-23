import { z } from 'zod';

export const createPackageSchema = z.object({
  title: z.string().min(1),

  description: z.string().min(1),

  duration: z.number().positive(),

  durationType: z.enum(['DAY', 'MONTH', 'YEAR']),

  price: z.number().positive(),

  originalPrice: z.number().optional(),

  discountPercentage: z.number().optional(),

  badge: z.string().optional(),

  features: z.array(z.string()),

  interestRequestLimit: z
    .number()
    .int()
    .nonnegative('Interest request limit cannot be negative.'),

  // Maximum interest requests allowed per day
  dailyInterestRequestLimit: z
    .number()
    .int()
    .nonnegative('Daily interest request limit cannot be negative.'),

  // Optional so existing admin-panel create/update calls that don't
  // send these fields yet keep working unchanged.
  callLimit: z
    .number()
    .int()
    .nonnegative('Call limit cannot be negative.')
    .optional(),

  dailyCallLimit: z
    .number()
    .int()
    .nonnegative('Daily call limit cannot be negative.')
    .optional(),

  messageLimit: z
    .number()
    .int()
    .nonnegative('Message limit cannot be negative.')
    .optional(),

  dailyMessageLimit: z
    .number()
    .int()
    .nonnegative('Daily message limit cannot be negative.')
    .optional(),

  isDeleted: z.boolean().optional(),

  displayOrder: z.number().optional(),
});

export const updatePackageSchema = createPackageSchema.partial();
