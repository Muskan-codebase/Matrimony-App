"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageSchema = exports.createPackageSchema = void 0;
const zod_1 = require("zod");
exports.createPackageSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    duration: zod_1.z.number().positive(),
    durationType: zod_1.z.enum(['DAY', 'MONTH', 'YEAR']),
    price: zod_1.z.number().positive(),
    originalPrice: zod_1.z.number().optional(),
    discountPercentage: zod_1.z.number().optional(),
    badge: zod_1.z.string().optional(),
    features: zod_1.z.array(zod_1.z.string()),
    interestRequestLimit: zod_1.z
        .number()
        .int()
        .nonnegative('Interest request limit cannot be negative.'),
    // Maximum interest requests allowed per day
    dailyInterestRequestLimit: zod_1.z
        .number()
        .int()
        .nonnegative('Daily interest request limit cannot be negative.'),
    // Optional so existing admin-panel create/update calls that don't
    // send these fields yet keep working unchanged.
    callLimit: zod_1.z
        .number()
        .int()
        .nonnegative('Call limit cannot be negative.')
        .optional(),
    dailyCallLimit: zod_1.z
        .number()
        .int()
        .nonnegative('Daily call limit cannot be negative.')
        .optional(),
    messageLimit: zod_1.z
        .number()
        .int()
        .nonnegative('Message limit cannot be negative.')
        .optional(),
    dailyMessageLimit: zod_1.z
        .number()
        .int()
        .nonnegative('Daily message limit cannot be negative.')
        .optional(),
    isDeleted: zod_1.z.boolean().optional(),
    displayOrder: zod_1.z.number().optional(),
});
exports.updatePackageSchema = exports.createPackageSchema.partial();
