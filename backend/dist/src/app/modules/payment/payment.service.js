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
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
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
    // 2. Generate Idempotency Key
    const idempotencyKey = crypto_1.default.randomUUID();
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
        idempotencyKey,
        razorpayOrderId: razorpayOrder.id,
        status: payment_interface_1.PaymentStatus.PENDING,
    });
    // 5. Return Razorpay Details
    return {
        paymentId: payment._id,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        idempotencyKey,
    };
});
exports.createPaymentOrder = createPaymentOrder;
const verifyPayment = (userId, razorpayOrderId, razorpayPaymentId, razorpaySignature, idempotencyKey) => __awaiter(void 0, void 0, void 0, function* () {
    // ==================================================
    // 1. Verify Razorpay Signature
    // ==================================================
    const isValid = (0, payment_util_1.verifyRazorpaySignature)(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
        throw new Error("Invalid payment signature");
    }
    // ==================================================
    // 2. Start MongoDB Transaction
    // ==================================================
    const session = yield mongoose_1.default.startSession();
    try {
        let result;
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            // ==========================================
            // 3. Find Payment using Idempotency Key
            // ==========================================
            const payment = yield payment_model_1.Payment.findOne({
                userId,
                idempotencyKey,
            }).session(session);
            if (!payment) {
                throw new Error("Payment record not found");
            }
            // ==========================================
            // 4. Verify Razorpay Order ID
            // ==========================================
            if (payment.razorpayOrderId !==
                razorpayOrderId) {
                throw new Error("Invalid payment order");
            }
            // ==========================================
            // 5. Atomic PENDING → SUCCESS
            // ==========================================
            const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({
                _id: payment._id,
                status: payment_interface_1.PaymentStatus.PENDING,
            }, {
                $set: {
                    status: payment_interface_1.PaymentStatus.SUCCESS,
                    razorpayPaymentId,
                    razorpaySignature,
                    paidAt: new Date(),
                },
            }, {
                new: true,
                session,
            });
            // ==========================================
            // 6. Already Processed
            // ==========================================
            if (!updatedPayment) {
                const existingPayment = yield payment_model_1.Payment.findById(payment._id).session(session);
                result = {
                    payment: existingPayment,
                    subscription: undefined,
                };
                return;
            }
            // ==========================================
            // 7. Fetch Package
            // ==========================================
            const packageData = yield package_model_1.default.findById(updatedPayment.packageId).session(session);
            if (!packageData) {
                throw new Error("Package not found");
            }
            // ==========================================
            // 8. Fetch Profile
            // ==========================================
            const profile = yield profile_model_1.Profile.findById(updatedPayment.profileId).session(session);
            if (!profile) {
                throw new Error("Profile not found");
            }
            // ==========================================
            // 9. Calculate Subscription Dates
            // ==========================================
            const startDate = new Date();
            const expiryDate = new Date(startDate);
            switch (packageData.durationType) {
                case "DAY":
                    expiryDate.setDate(expiryDate.getDate() +
                        packageData.duration);
                    break;
                case "MONTH":
                    expiryDate.setMonth(expiryDate.getMonth() +
                        packageData.duration);
                    break;
                case "YEAR":
                    expiryDate.setFullYear(expiryDate.getFullYear() +
                        packageData.duration);
                    break;
            }
            // ==========================================
            // 10. Replace Current Subscription
            // ==========================================
            profile.subscription = {
                isActive: true,
                packageId: updatedPayment.packageId,
                packageName: packageData.title,
                price: packageData.price,
                startDate,
                expiryDate,
            };
            yield profile.save({
                session,
            });
            // ==========================================
            // 11. Return Result
            // ==========================================
            result = {
                payment: updatedPayment,
                subscription: profile.subscription,
            };
        }));
        return result;
    }
    finally {
        yield session.endSession();
    }
});
exports.verifyPayment = verifyPayment;
// export const verifyPayment = async (
//     userId: Types.ObjectId,
//     razorpayOrderId: string,
//     razorpayPaymentId: string,
//     razorpaySignature: string,
// ) => {
//     // 1. Verify Razorpay Signature
//     const isValid = verifyRazorpaySignature(
//         razorpayOrderId,
//         razorpayPaymentId,
//         razorpaySignature
//     );
//     if (!isValid) {
//         throw new Error(
//             "Invalid payment signature"
//         );
//     }
//     // 2. Find payment record
//     const payment = await Payment.findOne({
//         razorpayOrderId,
//         userId
//     });
//     if (!payment) {
//         throw new Error(
//             "Payment record not found"
//         );
//     }
//     // 3. Idempotency Check
//     // Payment already processed
//     if (payment.status === PaymentStatus.SUCCESS) {
//         return payment;
//     }
//     // 4. Update Payment
//     payment.status = PaymentStatus.SUCCESS;
//     payment.razorpayPaymentId = razorpayPaymentId;
//     payment.razorpaySignature = razorpaySignature;
//     payment.paidAt = new Date();
//     await payment.save();
//     // ==========================================
//     // 5. Fetch Package Details
//     // ==========================================
//     const packageData = await Package.findById(
//         payment.packageId
//     );
//     if (!packageData) {
//         throw new Error(
//             "Package not found"
//         );
//     }
//     // ==========================================
//     // 6. Activate User Subscription
//     // ==========================================
//     const profile = await Profile.findById(
//         payment.profileId
//     );
//     if (!profile) {
//         throw new Error(
//             "Profile not found"
//         );
//     }
//     const startDate = new Date();
//     const expiryDate = new Date(startDate);
//     switch (packageData.durationType) {
//         case "DAY":
//             expiryDate.setDate(
//                 expiryDate.getDate() + packageData.duration
//             );
//             break;
//         case "MONTH":
//             expiryDate.setMonth(
//                 expiryDate.getMonth() + packageData.duration
//             );
//             break;
//         case "YEAR":
//             expiryDate.setFullYear(
//                 expiryDate.getFullYear() + packageData.duration
//             );
//             break;
//     }
//     profile.subscription = {
//         isActive: true,
//         packageId: payment.packageId,
//         packageName: packageData.title,
//         price: packageData.price,
//         startDate,
//         expiryDate,
//     };
//     await profile.save();
//     // ==========================================
//     // 7. Return Updated Payment
//     // ==========================================
//     return {
//         payment,
//         subscription: profile.subscription,
//     };
// };
