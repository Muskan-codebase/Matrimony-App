import mongoose, { Schema } from "mongoose";
import { IBlock } from "./block.interface";

const blockSchema = new Schema<IBlock>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
        blockedUserId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate blocks
blockSchema.index(
    { userId: 1, blockedUserId: 1 },
    { unique: true }
);

export const Block = mongoose.model<IBlock>(
    "Block",
    blockSchema
);