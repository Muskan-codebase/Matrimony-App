import { Schema, model } from 'mongoose';
import { IOnlinePersonalTip, PERSONAL_TIP_CATEGORIES } from './tips.interface';

const onlinePersonalTipSchema = new Schema<IOnlinePersonalTip>(
  {
    category: {
      type: String,
      required: true,
      enum: PERSONAL_TIP_CATEGORIES,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    subTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    displayOrder: {
      type: Number,
      required: true,
      default: 1,
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
    versionKey: false,
  },
);

export const OnlinePersonalTip = model<IOnlinePersonalTip>(
  'OnlinePersonalTip',
  onlinePersonalTipSchema,
);
