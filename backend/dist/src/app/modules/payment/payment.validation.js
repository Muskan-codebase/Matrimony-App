"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.createPaymentOrderSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        packageId: zod_1.z
            .string()
            .min(1, "Package ID is required"),
    })
});
exports.verifyPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        razorpayOrderId: zod_1.z
            .string()
            .min(1, "Razorpay order ID is required"),
        razorpayPaymentId: zod_1.z
            .string()
            .min(1, "Razorpay payment ID is required"),
        razorpaySignature: zod_1.z
            .string()
            .min(1, "Razorpay signature is required"),
    })
});
