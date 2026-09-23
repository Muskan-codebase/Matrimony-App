import { Schema, model, Document, Types } from 'mongoose';
import { IOnboarding, IOnboardingArr } from './onBoarding.interface';

export interface OnboardingArrDocument extends IOnboardingArr, Document { }

const OnboardingSchema = new Schema<IOnboarding>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { _id: true },
);

const OnboardingArrSchema = new Schema<OnboardingArrDocument>({
  content: { type: [OnboardingSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const OnboardingArr = model<OnboardingArrDocument>(
  'OnboardingArr',
  OnboardingArrSchema,
);
