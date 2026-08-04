import { Router } from "express";
import { authenticate } from "../../../middlewares/authMiddleware";
import { updateCallController } from "./call.controller";

const router = Router();
/**
 * @swagger
 * /v1/api/call/update:
 *   post:
 *     summary: Create or Update Voice Call Status
 *     description: |
 *       Creates a new call record when the status is **ringing** and updates the existing call
 *       for **answered**, **rejected**, **missed**, or **ended** events.
 *
 *       This API is called by the Flutter application whenever the call status changes.
 *
 *       Status Flow:
 *       - **ringing** → Creates a new call record.
 *       - **answered** → Updates the call as answered.
 *       - **rejected** → Updates the call as rejected.
 *       - **missed** → Updates the call as missed.
 *       - **ended** → Updates the call as ended and stores call duration.
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
 *               callerId:
 *                 type: string
 *                 example: "6893d8f9c3d77e0012abc123"
 *               receiverId:
 *                 type: string
 *                 example: "6893d90fc3d77e0012abc456"
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
 *               duration:
 *                 type: number
 *                 example: 145
 *                 description: Call duration in seconds. Required only when status is "ended".
 *               endedBy:
 *                 type: string
 *                 example: "6893d8f9c3d77e0012abc123"
 *                 description: Profile ID of the user who ended or rejected the call.
 *             required:
 *               - callId
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
router.post("/update", authenticate, updateCallController);

export const callRouter = router;