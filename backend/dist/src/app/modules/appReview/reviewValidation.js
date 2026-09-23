"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appReviewIdSchema = exports.createAppReviewSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const objectIdSchema = zod_1.z
    .string()
    .refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), {
    message: 'Invalid ID',
});
exports.createAppReviewSchema = zod_1.z.object({
    rating: zod_1.z
        .number('Rating is required')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5'),
    review: zod_1.z
        .string('Review is required')
        .trim()
        .min(3, 'Review must be at least 3 characters')
        .max(1000, 'Review cannot exceed 1000 characters'),
});
exports.appReviewIdSchema = zod_1.z.object({
    id: objectIdSchema,
});
