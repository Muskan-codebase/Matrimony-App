"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQ = void 0;
const mongoose_1 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    displayOrder: {
        type: Number,
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
}, {
    timestamps: true,
    versionKey: false,
});
exports.FAQ = (0, mongoose_1.model)("FAQ", faqSchema);
