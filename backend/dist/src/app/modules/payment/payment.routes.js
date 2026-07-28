"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const payment_controllers_1 = require("./payment.controllers");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   - name: Packages Payment
 *     description: APIs for creating package payment orders and verifying Razorpay payments
 */
/**
 * @swagger
 * /v1/api/payment/create-order:
 *   post:
 *     summary: Create Razorpay payment order
 *     description:
 *       Creates a Razorpay order for purchasing a selected package.
 *       The user selects a package, and this API validates the package,
 *       creates a Razorpay order, and stores a pending payment record.
 *     tags:
 *       - Packages Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - packageId
 *             properties:
 *               packageId:
 *                 type: string
 *                 example: "665f3a9c8d9b123456789abc"
 *                 description: ID of the package the user wants to purchase
 *     responses:
 *       200:
 *         description: Payment order created successfully
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
 *                   example: Payment order created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                       example: "666abc123456789"
 *                     orderId:
 *                       type: string
 *                       example: "order_Nb12345xyz"
 *                     amount:
 *                       type: number
 *                       example: 99900
 *                     currency:
 *                       type: string
 *                       example: INR
 *
 *       400:
 *         description: Invalid package details
 *
 *       401:
 *         description: Unauthorized user
 *
 *       500:
 *         description: Internal server error
 */
router.post("/create-order", authMiddleware_1.authenticate, payment_controllers_1.createOrder);
/**
 * @swagger
 * /v1/api/payment/verify:
 *   post:
 *     summary: Verify Razorpay payment
 *     description:
 *       Verifies the Razorpay payment signature after successful payment.
 *       On successful verification, the payment status is updated and the user's
 *       package subscription is activated.
 *     tags:
 *       - Packages Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpayOrderId
 *               - razorpayPaymentId
 *               - razorpaySignature
 *             properties:
 *               razorpayOrderId:
 *                 type: string
 *                 example: "order_Nb12345xyz"
 *                 description: Razorpay order ID generated during order creation
 *
 *               razorpayPaymentId:
 *                 type: string
 *                 example: "pay_Nb98765xyz"
 *                 description: Razorpay payment ID received after successful payment
 *
 *               razorpaySignature:
 *                 type: string
 *                 example: "a8f9d7e6c5b4..."
 *                 description: Razorpay generated payment signature for verification
 *
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Payment verified successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                       description: Updated payment record
 *
 *                     subscription:
 *                       type: object
 *                       description: Activated package subscription details
 *
 *       400:
 *         description: Invalid payment signature or payment verification failed
 *
 *       401:
 *         description: Unauthorized user
 *
 *       500:
 *         description: Internal server error
 */
router.post("/verify", authMiddleware_1.authenticate, payment_controllers_1.verifyPaymentController);
exports.paymentRouter = router;
