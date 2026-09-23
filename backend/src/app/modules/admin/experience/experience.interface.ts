import { Document } from "mongoose";

export interface IExperience {
  title: string;
  description: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface IExperienceDocument
  extends IExperience,
    Document {}