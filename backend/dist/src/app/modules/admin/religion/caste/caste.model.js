"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Caste = void 0;
const mongoose_1 = require("mongoose");
const casteSchema = new mongoose_1.Schema({
    religionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Religion",
        required: true,
    },
    caste: {
        type: String,
        required: true,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Prevent duplicate caste within same religion
casteSchema.index({
    religionId: 1,
    caste: 1,
}, {
    unique: true,
});
exports.Caste = (0, mongoose_1.model)("Caste", casteSchema);
