"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrimonyCounter = void 0;
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    mobileVerifiedProfiles: {
        type: String,
        required: true,
        trim: true,
    },
    customersServed: {
        type: String,
        required: true,
        trim: true,
    },
    successfulMatchmakingYears: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
exports.MatrimonyCounter = (0, mongoose_1.model)("MatrimonyCounter", counterSchema);
