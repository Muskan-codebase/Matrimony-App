"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlinePersonalTip = void 0;
const mongoose_1 = require("mongoose");
const tips_interface_1 = require("./tips.interface");
const onlinePersonalTipSchema = new mongoose_1.Schema({
    category: {
        type: String,
        required: true,
        enum: tips_interface_1.PERSONAL_TIP_CATEGORIES,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    subTitle: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    displayOrder: {
        type: Number,
        required: true,
        default: 1,
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
    versionKey: false,
});
exports.OnlinePersonalTip = (0, mongoose_1.model)('OnlinePersonalTip', onlinePersonalTipSchema);
