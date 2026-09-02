import { Schema, model } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";


const paymentSchema = new Schema<IPayment>(
    {

        userId: {
            type: Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },


        profileId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },


        packageId: {
            type: Schema.Types.ObjectId,
            ref: "Package",
            required: true,
        },


        amount: {
            type: Number,
            required: true,
        },

        idempotencyKey: {
            type: String,
            required: true,
            unique: true,
            index: true,
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
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
        },


        paidAt: {
            type: Date,
        },

    },
    {
        timestamps: true
    });


export const Payment = model<IPayment>(
    "Payment",
    paymentSchema
);