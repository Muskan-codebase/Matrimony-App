import { model, Schema } from 'mongoose';
import { IAppReview } from './reviewInterface';

const appReviewSchema = new Schema<IAppReview>(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

export const AppReview = model<IAppReview>('AppReview', appReviewSchema);
