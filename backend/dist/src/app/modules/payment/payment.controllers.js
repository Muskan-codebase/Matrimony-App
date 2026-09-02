"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentController = exports.createOrder = void 0;
const payment_service_1 = require("./payment.service");
const profile_model_1 = require("../profile-details/profile.model");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { packageId } = req.body;
        // Find user profile
        const profile = yield profile_model_1.Profile.findOne({
            userId
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }
        const result = yield (0, payment_service_1.createPaymentOrder)(userId, profile._id, packageId);
        res.status(200).json({
            success: true,
            message: "Payment order created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createOrder = createOrder;
const verifyPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, idempotencyKey, } = req.body;
        const payment = yield (0, payment_service_1.verifyPayment)(userId, razorpayOrderId, razorpayPaymentId, razorpaySignature, idempotencyKey);
        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: payment
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
exports.verifyPaymentController = verifyPaymentController;
