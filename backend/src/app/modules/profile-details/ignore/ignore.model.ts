import mongoose, { Schema } from "mongoose";
import { IIgnore } from "./ignore.interface";

const ignoreSchema = new Schema<IIgnore>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
        ignoredUserId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

ignoreSchema.index(
    { userId: 1, ignoredUserId: 1 },
    { unique: true }
);

export const Ignore = mongoose.model<IIgnore>(
    "Ignore",
    ignoreSchema
);