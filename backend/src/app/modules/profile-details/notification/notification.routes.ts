import express from "express";
import { authenticate } from "../../../middlewares/authMiddleware";
import * as notificationController from "./notification.controller";

const router = express.Router();
/**
 * @swagger
 * /v1/api/notification/register-token:
 *   post:
 *     summary: Register FCM Token
 *     description: Registers or updates the Firebase Cloud Messaging (FCM) token for the authenticated user's device. This token is used by the backend to send push notifications for profile visits, interest requests, shortlists, chats, and other events.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
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
 *                 example: "fcm_token_generated_by_firebase"
 *     responses:
 *       200:
 *         description: FCM token registered successfully.
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
 *                   example: "FCM token registered successfully."
 *       400:
 *         description: Validation error.
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
 *                   example: "FCM token is required."
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/register-token", authenticate, notificationController.registerToken);

export const notificationRouter = router;