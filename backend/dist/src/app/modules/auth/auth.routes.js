"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
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
router.post("/send-otp", auth_controller_1.sendOTP);
/**
 * @swagger
 * /v1/api/auth/verify-otp:
 *   post:
 *     summary: Verify Firebase Authentication Token
 *     description: Verifies the Firebase ID token received after OTP authentication, validates the mobile number, checks the user account, and returns application access and refresh tokens.
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
 *               - token
 *             properties:
 *               mobile:
 *                 type: string
 *                 description: Mobile number associated with the Firebase authentication.
 *                 example: "+919876543210"
 *               token:
 *                 type: string
 *                 description: Firebase ID token received after successful OTP verification on the Flutter app.
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
 *     responses:
 *       200:
 *         description: Firebase token verified and user logged in successfully.
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
 *                   example: "Logged in successfully."
 *                 isNewUser:
 *                   type: boolean
 *                   example: false
 *                 accessToken:
 *                   type: string
 *                   description: Application access token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   description: Application refresh token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   description: Authenticated user's account details.
 *       400:
 *         description: Invalid request or Firebase token verification failed.
 *       401:
 *         description: Firebase token does not contain a phone number or the mobile number does not match the Firebase token.
 *       404:
 *         description: User not found.
 */
router.post("/verify-otp", auth_controller_1.verifyOTP);
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
router.post("/resend-otp", auth_controller_1.resendOTP);
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
router.post("/refresh-token", auth_controller_1.refreshToken);
/**
 * @swagger
 * /v1/api/auth/firebase-uid:
 *   post:
 *     summary: Save Firebase UID
 *     description: Saves the Firebase UID of the currently authenticated user for Firebase services such as online/offline presence and messaging.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseUid
 *             properties:
 *               firebaseUid:
 *                 type: string
 *                 example: "abc123XYZfirebaseUid"
 *                 description: Firebase Authentication UID of the logged-in user.
 *     responses:
 *       200:
 *         description: Firebase UID saved successfully.
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
 *                   example: Firebase UID saved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     firebaseUid:
 *                       type: string
 *                       example: "abc123XYZfirebaseUid"
 *
 *       400:
 *         description: Firebase UID is missing or invalid.
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
 *                   example: Firebase UID is required.
 *
 *       401:
 *         description: Unauthorized. Access token is missing or invalid.
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
 *                   example: Unauthorized.
 *
 *       404:
 *         description: User not found.
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
 *                   example: User not found.
 *
 *       409:
 *         description: Firebase UID is already linked to another account.
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
 *                   example: This Firebase UID is already linked to another account.
 *
 *       500:
 *         description: Internal server error.
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
 *                   example: Internal server error.
 */
router.post("/firebase-uid", authMiddleware_1.authenticate, auth_controller_1.saveFirebaseUid);
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
router.get("/me", authMiddleware_1.authenticate, auth_controller_1.getCurrentUser);
exports.authRouter = router;
