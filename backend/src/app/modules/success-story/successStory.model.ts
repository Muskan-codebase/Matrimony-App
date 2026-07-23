import mongoose, { Schema } from "mongoose";
import { ISuccessStory } from "./successStory.interface";

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

    isDeleted: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
});

export const SuccessStory = mongoose.model(
    "SuccessStory",
    successStorySchema
);