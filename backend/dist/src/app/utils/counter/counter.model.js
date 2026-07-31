"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    sequence: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Counter = (0, mongoose_1.model)("Counter", counterSchema);
