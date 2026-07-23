"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Height = void 0;
const mongoose_1 = require("mongoose");
const heightSchema = new mongoose_1.Schema({
    height: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Height = (0, mongoose_1.model)("Height", heightSchema);
