import mongoose, { Schema } from 'mongoose';
import { ISuccessStory } from './stories.interface';

const successStorySchema = new Schema<ISuccessStory>(
  {
    groomName: {
      type: String,
      required: true,
      trim: true,
    },

    brideName: {
      type: String,
      required: true,
      trim: true,
    },

    badge: {
      type: String,
      trim: true,
      default: 'New',
    },

    marriedDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    story: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const SuccessStory = mongoose.model<ISuccessStory>(
  'SuccessStory',
  successStorySchema,
);
