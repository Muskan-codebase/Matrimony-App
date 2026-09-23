"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCentre = void 0;
const mongoose_1 = require("mongoose");
const helpCentreSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    icon: {
        type: String,
        trim: true,
    },
    displayOrder: {
        type: Number,
        default: 0,
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
});
exports.HelpCentre = (0, mongoose_1.model)("HelpCentre", helpCentreSchema);
