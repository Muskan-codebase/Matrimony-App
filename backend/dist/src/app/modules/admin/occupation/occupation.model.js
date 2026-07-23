"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Occupation = void 0;
const mongoose_1 = require("mongoose");
const occupationSchema = new mongoose_1.Schema({
    occupation: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Occupation = (0, mongoose_1.model)("Occupation", occupationSchema);
