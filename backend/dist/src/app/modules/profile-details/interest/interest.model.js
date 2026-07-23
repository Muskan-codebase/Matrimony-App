"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interest = void 0;
const mongoose_1 = require("mongoose");
const interestSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
// Prevent duplicate interests between the same two users
interestSchema.index({
    senderId: 1,
    receiverId: 1,
}, {
    unique: true,
});
exports.Interest = (0, mongoose_1.model)("Interest", interestSchema);
