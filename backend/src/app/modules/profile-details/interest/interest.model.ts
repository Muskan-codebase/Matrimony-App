import { Schema, model } from "mongoose";
import { IInterest } from "./interest.interface";

const interestSchema = new Schema<IInterest>(
    {

        senderId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },

        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Rejected",
                "Withdrawn",
            ],
            default: "Pending",
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);

// Prevent duplicate interests between the same two users
interestSchema.index(
    {
        senderId: 1,
        receiverId: 1,
    },
    {
        unique: true,
    }
);

export const Interest = model<IInterest>(
    "Interest",
    interestSchema
);