import { Document } from 'mongoose';

export interface ISuccessStory extends Document {
  groomName: string;
  brideName: string;

  badge: string;
  marriedDate: Date;
  location: string;
  story: string;
  year: number;
  image: string;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
