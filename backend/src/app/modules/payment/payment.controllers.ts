import { Request, Response } from "express";
import { createPaymentOrder, verifyPayment } from "./payment.service";
import { Profile } from "../profile-details/profile.model";

export const createOrder = async (req: Request, res: Response) => {

    try {

        const userId = req.user.id;
        const { packageId } = req.body;


        // Find user profile
        const profile = await Profile.findOne({
            userId
        });


        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }


        const result = await createPaymentOrder(
            userId,
            profile._id,
            packageId
        );


        res.status(200).json({
            success: true,
            message: "Payment order created successfully",
            data: result,
        });


    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyPaymentController = async (
    req: Request,
    res: Response
) => {

    try {

        const userId = req.user.id;

        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            idempotencyKey,
        } = req.body;

        const payment = await verifyPayment(
            userId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            idempotencyKey,
        );

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: payment
        });
    }
    catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }

};