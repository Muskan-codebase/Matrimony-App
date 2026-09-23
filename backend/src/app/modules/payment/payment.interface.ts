import { Types } from "mongoose";


export enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}


export interface IPayment {

    userId: Types.ObjectId;

    profileId: Types.ObjectId;

    packageId: Types.ObjectId;


    amount: number;
    idempotencyKey: string;


    razorpayOrderId?: string;

    razorpayPaymentId?: string;

    razorpaySignature?: string;


    status: PaymentStatus;


    paidAt?: Date;

}