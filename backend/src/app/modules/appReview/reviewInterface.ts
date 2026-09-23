import { Document, Types } from 'mongoose';

export interface IAppReview extends Document {
  profileId: Types.ObjectId;

  rating: number;
  review: string;

  createdAt: Date;
  updatedAt: Date;
}
