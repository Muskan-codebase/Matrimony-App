import { Router } from "express";

import {
    sendOTP,
    verifyOTP,
    resendOTP,
    refreshToken,
    getCurrentUser,
} from "./auth.controller";

import { authenticate } from "../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * /v1/api/auth/send-otp:
 *   post:
 *     summary: Send OTP
 *     description: Generates and sends an OTP to the user's registered mobile number.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - countryCode
 *               - mobile
 *             properties:
 *               countryCode:
 *                 type: string
 *                 example: "+91"
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *       400:
 *         description: Validation error.
 */
router.post("/send-otp", sendOTP);
/**
 * @swagger
 * /v1/api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verifies the OTP and returns an access token and refresh token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - otp
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       400:
 *         description: Invalid OTP.
 *       404:
 *         description: User not found.
 */
router.post("/verify-otp", verifyOTP);
/**
 * @swagger
 * /v1/api/auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     description: Generates and sends a new OTP after validating resend limits and cooldown.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP resent successfully.
 *       400:
 *         description: No active OTP found.
 *       404:
 *         description: User not found.
 *       429:
 *         description: Maximum resend limit reached or cooldown active.
 */
router.post("/resend-otp", resendOTP);
/**
 * @swagger
 * /v1/api/auth/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     description: Generates a new access token and refresh token using a valid refresh token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       401:
 *         description: Invalid or expired refresh token.
 */
router.post("/refresh-token", refreshToken);
/**
 * @swagger
 * /v1/api/auth/me:
 *   get:
 *     summary: Get Current User
 *     description: Returns the authenticated user's profile.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.get("/me", authenticate, getCurrentUser);

export const authRouter = router;