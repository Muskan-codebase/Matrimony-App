"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnualIncome = void 0;
const mongoose_1 = require("mongoose");
const annualIncomeSchema = new mongoose_1.Schema({
    annualIncome: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    minIncome: {
        type: Number,
        required: true,
        min: 0,
    },
    maxIncome: {
        type: Number,
        default: null,
        validate: {
            validator: function (value) {
                return value === null || value >= this.minIncome;
            },
            message: "maxIncome must be greater than or equal to minIncome.",
        },
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.AnnualIncome = (0, mongoose_1.model)("AnnualIncome", annualIncomeSchema);
