import { z } from "zod";

export const createPaymentOrderSchema = z.object({

    body: z.object({

        packageId: z
            .string()
            .min(1, "Package ID is required"),

    })

});

export const verifyPaymentSchema = z.object({

    body: z.object({

        razorpayOrderId: z
            .string()
            .min(1, "Razorpay order ID is required"),


        razorpayPaymentId: z
            .string()
            .min(1, "Razorpay payment ID is required"),


        razorpaySignature: z
            .string()
            .min(1, "Razorpay signature is required"),

    })

});