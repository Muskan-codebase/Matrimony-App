"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCaste = void 0;
const mongoose_1 = require("mongoose");
const subCasteSchema = new mongoose_1.Schema({
    religionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Religion",
        required: true,
    },
    casteId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Caste",
        required: true,
    },
    subCaste: {
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
// Prevent duplicate sub-caste under same caste
subCasteSchema.index({
    casteId: 1,
    subCaste: 1,
}, {
    unique: true,
});
exports.SubCaste = (0, mongoose_1.model)("SubCaste", subCasteSchema);
