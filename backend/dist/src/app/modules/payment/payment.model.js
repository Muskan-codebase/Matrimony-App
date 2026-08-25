"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    profileId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    packageId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Package",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    razorpayOrderId: {
        type: String,
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpaySignature: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PaymentStatus),
        default: payment_interface_1.PaymentStatus.PENDING,
    },
    paidAt: {
        type: Date,
    },
}, {
    timestamps: true
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
