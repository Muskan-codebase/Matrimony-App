"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const chat_controllers_1 = require("./chat.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /v1/api/chat/create-room:
 *   post:
 *     summary: Create Chat Room
 *     description: Creates a chat room between two users only if the interest request has been accepted. If a chat room already exists, the existing room is returned.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - interestId
 *             properties:
 *               receiverId:
 *                 type: string
 *                 example: "6a5487a89b2e535513fd7b12"
 *               interestId:
 *                 type: string
 *                 example: "6a54b7afe5b2731244e0c40a"
 *     responses:
 *       201:
 *         description: Chat room created successfully.
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
 *                   example: Chat room created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       example: "6a5487a89b2e535513fd7b12_6a54891f9b2e535513fd7b49"
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "6a54891f9b2e535513fd7b49"
 *                         - "6a5487a89b2e535513fd7b12"
 *                     interestId:
 *                       type: string
 *                       example: "6a54b7afe5b2731244e0c40a"
 *                     createdBy:
 *                       type: string
 *                       example: "6a54891f9b2e535513fd7b49"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     lastMessage:
 *                       type: string
 *                       example: ""
 *                     lastMessageSender:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     lastMessageType:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     lastMessageAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad Request
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
 *                   examples:
 *                     interestNotFound:
 *                       value: Interest request not found.
 *                     interestNotAccepted:
 *                       value: Chat is allowed only after the interest request is accepted.
 *                     invalidParticipants:
 *                       value: Invalid chat participants.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post("/create-room", authMiddleware_1.authenticate, chat_controllers_1.createChat);
exports.chatRouter = router;
