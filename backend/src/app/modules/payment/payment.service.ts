import { Payment } from "./payment.model";
import { PaymentStatus } from "./payment.interface";
import Package from "../package/package.model";
import { razorpay } from "../../config/razorpay";
import { Types } from "mongoose";
import { verifyRazorpaySignature } from "../../utils/payment.util";
import { Profile } from "../profile-details/profile.model";
import crypto from "crypto";
import mongoose from "mongoose";

export const createPaymentOrder = async (
    userId: Types.ObjectId,
    profileId: Types.ObjectId,
    packageId: Types.ObjectId
) => {

    // 1. Find Package
    const packageData = await Package.findById(packageId);

    if (!packageData) {
        throw new Error("Package not found");
    }

    // 2. Check Package Active Status
    // if (!packageData.isActive) {
    //     throw new Error("This package is currently unavailable");
    // }

    // 2. Generate Idempotency Key
    const idempotencyKey = crypto.randomUUID();

    // 3. Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({

        amount: packageData.price * 100, // Razorpay accepts paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
            packageId: packageData.id,
            userId: userId.toString(),
        },
    });

    // 4. Save Payment Record
    const payment = await Payment.create({

        userId,
        profileId,
        packageId: packageData._id,
        amount: packageData.price,
        idempotencyKey,
        razorpayOrderId: razorpayOrder.id,
        status: PaymentStatus.PENDING,

    });

    // 5. Return Razorpay Details
    return {
        paymentId: payment._id,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        idempotencyKey,
    };

};

export const verifyPayment = async (
    userId: Types.ObjectId,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    idempotencyKey: string
) => {

    // ==================================================
    // 1. Verify Razorpay Signature
    // ==================================================

    const isValid = verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
    );

    if (!isValid) {
        throw new Error("Invalid payment signature");
    }


    // ==================================================
    // 2. Start MongoDB Transaction
    // ==================================================

    const session = await mongoose.startSession();

    try {

        let result: any;


        await session.withTransaction(async () => {

            // ==========================================
            // 3. Find Payment using Idempotency Key
            // ==========================================

            const payment = await Payment.findOne({
                userId,
                idempotencyKey,
            }).session(session);


            if (!payment) {
                throw new Error("Payment record not found");
            }


            // ==========================================
            // 4. Verify Razorpay Order ID
            // ==========================================

            if (
                payment.razorpayOrderId !==
                razorpayOrderId
            ) {
                throw new Error("Invalid payment order");
            }


            // ==========================================
            // 5. Atomic PENDING → SUCCESS
            // ==========================================

            const updatedPayment =
                await Payment.findOneAndUpdate(
                    {
                        _id: payment._id,
                        status: PaymentStatus.PENDING,
                    },
                    {
                        $set: {

                            status: PaymentStatus.SUCCESS,
                            razorpayPaymentId,
                            razorpaySignature,
                            paidAt: new Date(),
                        },
                    },

                    {
                        new: true,
                        session,
                    }
                );

            // ==========================================
            // 6. Already Processed
            // ==========================================

            if (!updatedPayment) {

                const existingPayment =
                    await Payment.findById(
                        payment._id
                    ).session(session);


                result = {
                    payment: existingPayment,
                    subscription: undefined,
                };

                return;
            }
            // ==========================================
            // 7. Fetch Package
            // ==========================================

            const packageData =
                await Package.findById(
                    updatedPayment.packageId
                ).session(session);


            if (!packageData) {
                throw new Error(
                    "Package not found"
                );
            }
            // ==========================================
            // 8. Fetch Profile
            // ==========================================

            const profile =
                await Profile.findById(
                    updatedPayment.profileId
                ).session(session);


            if (!profile) {
                throw new Error(
                    "Profile not found"
                );
            }


            // ==========================================
            // 9. Calculate Subscription Dates
            // ==========================================

            const startDate = new Date();
            const expiryDate =
                new Date(startDate);


            switch (packageData.durationType) {

                case "DAY":
                    expiryDate.setDate(
                        expiryDate.getDate() +
                        packageData.duration
                    );
                    break;


                case "MONTH":
                    expiryDate.setMonth(
                        expiryDate.getMonth() +
                        packageData.duration
                    );
                    break;


                case "YEAR":
                    expiryDate.setFullYear(
                        expiryDate.getFullYear() +
                        packageData.duration
                    );
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


            await profile.save({
                session,
            });


            // ==========================================
            // 11. Return Result
            // ==========================================

            result = {
                payment: updatedPayment,
                subscription:
                    profile.subscription,
            };
        });


        return result;


    } finally {

        await session.endSession();
    }
};

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