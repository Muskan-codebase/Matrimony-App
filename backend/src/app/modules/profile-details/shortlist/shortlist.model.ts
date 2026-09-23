import mongoose, { Schema } from "mongoose";
import { IShortlist } from "./shortlist.interface";

const shortlistSchema = new Schema<IShortlist>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },

        shortlistedUserId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate shortlists
shortlistSchema.index(
    { userId: 1, shortlistedUserId: 1 },
    { unique: true }
);

export const Shortlist = mongoose.model<IShortlist>(
    "Shortlist",
    shortlistSchema
);