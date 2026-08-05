"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const call_controller_1 = require("./call.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /v1/api/call/update:
 *   post:
 *     summary: Create or Update Call Status
 *     description: |
 *       Creates a new call record when the call starts and updates the call status
 *       whenever it changes.
 *
 *       This API is called by the Flutter application during the call lifecycle.
 *
 *       Status Flow:
 *       - **ringing** → Creates a new call record.
 *       - **answered** → Updates the call as answered.
 *       - **rejected** → Updates the call as rejected.
 *       - **missed** → Updates the call as missed.
 *       - **ended** → Updates the call as ended.
 *
 *       The Flutter application can determine whether the call is **Incoming**
 *       or **Outgoing** by comparing the authenticated user's Profile ID with
 *       the `senderId`.
 *
 *     tags:
 *       - Voice Call
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               callId:
 *                 type: string
 *                 example: "4d5bce4f-9af7-47d2-9b58-fbb24d8d1abc"
 *               senderId:
 *                 type: string
 *                 example: "6893d8f9c3d77e0012abc123"
 *                 description: Profile ID of the user who initiated the call.
 *               receiverId:
 *                 type: string
 *                 example: "6893d90fc3d77e0012abc456"
 *                 description: Profile ID of the user receiving the call.
 *               callType:
 *                 type: string
 *                 enum:
 *                   - voice
 *                   - video
 *                 example: voice
 *               status:
 *                 type: string
 *                 enum:
 *                   - ringing
 *                   - answered
 *                   - rejected
 *                   - missed
 *                   - ended
 *                 example: ringing
 *             required:
 *               - callId
 *               - senderId
 *               - receiverId
 *               - callType
 *               - status
 *     responses:
 *       200:
 *         description: Call status updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Call updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.post("/update", authMiddleware_1.authenticate, call_controller_1.updateCallController);
/**
 * @swagger
 * /v1/api/call/history:
 *   get:
 *     tags:
 *       - Voice Call
 *     summary: Get Call History
 *     description: Fetches all voice/video call history of the authenticated user from Firestore.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Call history fetched successfully.
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
 *                   example: Calls fetched successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       callId:
 *                         type: string
 *                         example: e81344ab-025b-480c-aff7-ab86635eeaf8
 *                       senderId:
 *                         type: string
 *                         example: 6a6d7efcf29afe029cc242ab
 *                       receiverId:
 *                         type: string
 *                         example: 6a71b1db46114899021022cc
 *                       callType:
 *                         type: string
 *                         enum: [voice, video]
 *                         example: voice
 *                       status:
 *                         type: string
 *                         enum: [ringing, answered, ended, rejected, missed]
 *                         example: ended
 *                       duration:
 *                         type: number
 *                         example: 135
 *                       endedBy:
 *                         type: string
 *                         nullable: true
 *                         example: 6a6d7efcf29afe029cc242ab
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-08-05T10:30:00.000Z
 *       401:
 *         description: Unauthorized. Invalid or missing authentication token.
 *       500:
 *         description: Internal server error.
 */
router.get("/history", authMiddleware_1.authenticate, call_controller_1.getCallsController);
exports.callRouter = router;
