"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotherTongue = void 0;
const mongoose_1 = require("mongoose");
const motherTongueSchema = new mongoose_1.Schema({
    motherTongue: {
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
exports.MotherTongue = (0, mongoose_1.model)("MotherTongue", motherTongueSchema);
