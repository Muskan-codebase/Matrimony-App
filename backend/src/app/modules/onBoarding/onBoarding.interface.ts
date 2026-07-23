import { Types } from 'mongoose';

export interface IOnboarding {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  image: string;
  status: 'Active' | 'Inactive';
}

export interface IOnboardingArr {
  content: IOnboarding[];
  createdAt: Date;
}
