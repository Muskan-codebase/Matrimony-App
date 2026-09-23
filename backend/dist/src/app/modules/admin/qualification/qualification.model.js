"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qualification = void 0;
const mongoose_1 = require("mongoose");
const qualificationSchema = new mongoose_1.Schema({
    qualification: {
        type: String,
        required: true,
        trim: true,
    },
    educationType: {
        type: String,
        required: true,
        trim: true,
    },
    occupation: {
        type: String,
        required: true,
        trim: true,
    },
    // annualIncome: {
    //     type: String,
    //     required: true,
    //     trim: true,
    // },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Qualification = (0, mongoose_1.model)("Qualification", qualificationSchema);
