"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const mongoose_1 = require("mongoose");
const bannerSchema = new mongoose_1.Schema({
    image: {
        type: String,
        required: true,
        trim: true,
    },
    badge: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
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
}, {
    timestamps: true,
    versionKey: false,
});
exports.Banner = (0, mongoose_1.model)("Banner", bannerSchema);
