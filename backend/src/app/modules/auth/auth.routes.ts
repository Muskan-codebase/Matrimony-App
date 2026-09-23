import { Router } from "express";

import {
    sendOTP,
    verifyOTP,
    resendOTP,
    refreshToken,
    getCurrentUser,
    saveFirebaseUid,
    googleLogin,
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
 *     summary: Verify Firebase Authentication Token
 *     description: Verifies the Firebase ID token received after successful OTP authentication, validates the country code and mobile number, checks the user account, and returns application access and refresh tokens.
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
 *               - countryCode
 *               - token
 *             properties:
 *               mobile:
 *                 type: string
 *                 description: 10-digit mobile number associated with the Firebase authentication.
 *                 example: "9876543210"
 *               countryCode:
 *                 type: string
 *                 description: International country calling code associated with the mobile number.
 *                 example: "+91"
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
router.post("/verify-otp", verifyOTP);
/**
  * @swagger
  * /v1/api/auth/google-login:
  *   post:
  *     summary: Login or register using Google
  *     description: |
  *       Authenticates a user using a Firebase ID token obtained after
  *       successful Google Sign-In. The Firebase ID token is verified
  *       on the server and the user is either logged in or registered.
  *     tags:
  *       - Authentication
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - token
  *             properties:
  *               token:
  *                 type: string
  *                 description: Firebase ID token received after successful Google authentication
  *                 example: eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1Njc4OSJ9...
  *     responses:
  *       200:
  *         description: Google authentication successful
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
  *                   example: Logged in successfully.
  *                 isNewUser:
  *                   type: boolean
  *                   example: false
  *                 accessToken:
  *                   type: string
  *                   description: JWT access token
  *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  *                 refreshToken:
  *                   type: string
  *                   description: JWT refresh token
  *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  *                 user:
  *                   type: object
  *                   description: Authenticated user information
  *                   example:
  *                     _id: 66c123456789abcdef123456
  *                     email: user@gmail.com
  *                     firebaseUid: abc123xyz456
  *                     isVerified: true
  *                     loginCount: 5
  *                     lastLogin: 2026-09-01T06:30:00.000Z
  *       400:
  *         description: Invalid request or authentication error
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
  *                   example: Firebase token is required
  *       401:
  *         description: Invalid, expired, or non-Google Firebase token
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
  *                   example: Firebase token is not from Google authentication.
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
  *                   example: Something went wrong during Google login
  */
router.post("/google-login", googleLogin);
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
router.post("/firebase-uid", authenticate, saveFirebaseUid);
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