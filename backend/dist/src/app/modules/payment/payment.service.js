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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createPaymentOrder = void 0;
const payment_model_1 = require("./payment.model");
const payment_interface_1 = require("./payment.interface");
const package_model_1 = __importDefault(require("../package/package.model"));
const razorpay_1 = require("../../config/razorpay");
const payment_util_1 = require("../../utils/payment.util");
const profile_model_1 = require("../profile-details/profile.model");
const createPaymentOrder = (userId, profileId, packageId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Find Package
    const packageData = yield package_model_1.default.findById(packageId);
    if (!packageData) {
        throw new Error("Package not found");
    }
    // 2. Check Package Active Status
    // if (!packageData.isActive) {
    //     throw new Error("This package is currently unavailable");
    // }
    // 3. Create Razorpay Order
    const razorpayOrder = yield razorpay_1.razorpay.orders.create({
        amount: packageData.price * 100, // Razorpay accepts paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
            packageId: packageData.id,
            userId: userId.toString(),
        },
    });
    // 4. Save Payment Record
    const payment = yield payment_model_1.Payment.create({
        userId,
        profileId,
        packageId: packageData._id,
        amount: packageData.price,
        razorpayOrderId: razorpayOrder.id,
        status: payment_interface_1.PaymentStatus.PENDING,
    });
    // 5. Return Razorpay Details
    return {
        paymentId: payment._id,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
    };
});
exports.createPaymentOrder = createPaymentOrder;
const verifyPayment = (userId, razorpayOrderId, razorpayPaymentId, razorpaySignature) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Verify Razorpay Signature
    const isValid = (0, payment_util_1.verifyRazorpaySignature)(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
        throw new Error("Invalid payment signature");
    }
    // 2. Find payment record
    const payment = yield payment_model_1.Payment.findOne({
        razorpayOrderId,
        userId
    });
    if (!payment) {
        throw new Error("Payment record not found");
    }
    // 3. Idempotency Check
    // Payment already processed
    if (payment.status === payment_interface_1.PaymentStatus.SUCCESS) {
        return payment;
    }
    // 4. Update Payment
    payment.status = payment_interface_1.PaymentStatus.SUCCESS;
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.paidAt = new Date();
    yield payment.save();
    // ==========================================
    // 5. Fetch Package Details
    // ==========================================
    const packageData = yield package_model_1.default.findById(payment.packageId);
    if (!packageData) {
        throw new Error("Package not found");
    }
    // ==========================================
    // 6. Activate User Subscription
    // ==========================================
    const profile = yield profile_model_1.Profile.findById(payment.profileId);
    if (!profile) {
        throw new Error("Profile not found");
    }
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (packageData === null || packageData === void 0 ? void 0 : packageData.duration));
    profile.subscription = {
        isActive: true,
        packageId: payment.packageId,
        packageName: packageData.title,
        startDate,
        expiryDate,
    };
    yield profile.save();
    // ==========================================
    // 7. Return Updated Payment
    // ==========================================
    return {
        payment,
        subscription: profile.subscription,
    };
});
exports.verifyPayment = verifyPayment;
