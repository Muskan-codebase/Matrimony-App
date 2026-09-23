"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppReview = void 0;
const mongoose_1 = require("mongoose");
const appReviewSchema = new mongoose_1.Schema({
    profileId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
        index: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
}, {
    timestamps: true,
});
exports.AppReview = (0, mongoose_1.model)('AppReview', appReviewSchema);
