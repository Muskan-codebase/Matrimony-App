import mongoose, { Schema } from "mongoose";
import {
  IExperienceDocument,
} from "./experience.interface";

const experienceSchema = new Schema<IExperienceDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      trim: true,
      default: "",
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

experienceSchema.index({
  sortOrder: 1,
  isActive: 1,
});

const Experience = mongoose.model<IExperienceDocument>(
  "Experience",
  experienceSchema
);

export default Experience;