import mongoose, { Schema } from 'mongoose';
import { IPackage } from './package.interface';

const packageSchema = new Schema<IPackage>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    durationType: {
      type: String,
      enum: ['DAY', 'MONTH', 'YEAR'],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: Number,

    discountPercentage: Number,

    badge: String,

    features: [
      {
        type: String,
      },
    ],

    // Maximum number of interest requests
    // a user can send with this package.
    interestRequestLimit: {
      type: Number,
      required: true,
      min: 0,
    },

    dailyInterestRequestLimit: {
      type: Number,
      required: true,
      min: 0,
    },

    // Not `required` on purpose: existing packages in the DB were
    // created before calling existed. Defaulting to a high number
    // means old packages behave as "effectively unlimited" until an
    // admin edits them via the existing update-package route.
    callLimit: {
      type: Number,
      min: 0,
      default: 9999,
    },

    dailyCallLimit: {
      type: Number,
      min: 0,
      default: 9999,
    },

    // Not `required`, same reasoning as callLimit/dailyCallLimit —
    // keeps existing Package documents valid without a migration.
    messageLimit: {
      type: Number,
      min: 0,
      default: 9999,
    },

    dailyMessageLimit: {
      type: Number,
      min: 0,
      default: 9999,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IPackage>('Package', packageSchema);
