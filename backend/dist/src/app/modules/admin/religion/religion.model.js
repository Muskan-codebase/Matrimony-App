"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Religion = void 0;
const mongoose_1 = require("mongoose");
const religionSchema = new mongoose_1.Schema({
    religion: {
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
exports.Religion = (0, mongoose_1.model)("Religion", religionSchema);
