import { Router } from "express";
import { previewPaymentController } from "./paymentPreview.controller";

const router = Router();

/**
 * @swagger
 * /v1/api/payment/preview:
 *   post:
 *     summary: Preview payment amount
 *     description: |
 *       Calculates the final payable amount for a package before creating
 *       a Razorpay order. If the user has an active subscription, the
 *       unused subscription amount is deducted from the new package price.
 *     tags:
 *       - Package - Payable Amount
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profileId
 *               - packageId
 *             properties:
 *               profileId:
 *                 type: string
 *                 description: MongoDB ObjectId of the user's profile
 *                 example: "68b123456789abcdef123456"
 *               packageId:
 *                 type: string
 *                 description: MongoDB ObjectId of the package
 *                 example: "68b987654321abcdef654321"
 *     responses:
 *       200:
 *         description: Payment preview fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment preview fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     packageId:
 *                       type: string
 *                       example: "68b987654321abcdef654321"
 *                     packageName:
 *                       type: string
 *                       example: "Gold Package"
 *                     packagePrice:
 *                       type: number
 *                       example: 499
 *                     unusedAmount:
 *                       type: number
 *                       example: 100
 *                     remainingDays:
 *                       type: number
 *                       example: 15
 *                     payableAmount:
 *                       type: number
 *                       example: 399
 *                     currency:
 *                       type: string
 *                       example: "INR"
 *       400:
 *         description: Missing or invalid profileId/packageId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: profileId and packageId are required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to fetch payment preview
 */
router.post("/preview", previewPaymentController);

export const paymentPreviewRouter = router;