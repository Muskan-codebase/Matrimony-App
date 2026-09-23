"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingArr = void 0;
const mongoose_1 = require("mongoose");
const OnboardingSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        type: String,
        trim: true,
        default: "",
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
}, { _id: true });
const OnboardingArrSchema = new mongoose_1.Schema({
    content: { type: [OnboardingSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
});
exports.OnboardingArr = (0, mongoose_1.model)('OnboardingArr', OnboardingArrSchema);
