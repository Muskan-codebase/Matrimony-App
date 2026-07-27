import { Router } from "express";
import { createChat, sendMessageController, getChatsController, getAllMyMessages } from "./chat.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";
import { upload } from "../../../config/cloudinary";

const router = Router();
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
 *               - interestId
 *             properties:
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
router.post("/create-room", authenticate, createChat);
/**
 * @swagger
 * /v1/api/chat/send-message:
 *   post:
 *     summary: Send Message
 *     description: Sends a text message or file attachment (image, video, audio, document) to an existing chat room. Files are uploaded to Cloudinary and the attachment metadata is stored in Firestore.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - type
 *             properties:
 *               roomId:
 *                 type: string
 *                 example: "6892d4d51c6d6d7c2ab4f501_6892d55f1c6d6d7c2ab4f57a"
 *                 description: Chat room ID.
 *               text:
 *                 type: string
 *                 example: "Hello! How are you?"
 *                 description: Message text. Required only when type is TEXT.
 *               type:
 *                 type: string
 *                 enum:
 *                   - TEXT
 *                   - IMAGE
 *                   - VIDEO
 *                   - AUDIO
 *                   - DOCUMENT
 *                 example: TEXT
 *                 description: Type of message being sent.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional file attachment. Required for IMAGE, VIDEO, AUDIO and DOCUMENT message types.
 *     responses:
 *       201:
 *         description: Message sent successfully.
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
 *                   example: Message sent successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     roomId:
 *                       type: string
 *                       example: "6892d4d51c6d6d7c2ab4f501_6892d55f1c6d6d7c2ab4f57a"
 *                     messageId:
 *                       type: string
 *                       example: "L1kA3vH5s9w2PqXnB8Rt"
 *                     senderId:
 *                       type: string
 *                       example: "6892d4d51c6d6d7c2ab4f501"
 *                     receiverId:
 *                       type: string
 *                       example: "6892d55f1c6d6d7c2ab4f57a"
 *                     text:
 *                       type: string
 *                       example: "Hello! How are you?"
 *                     type:
 *                       type: string
 *                       example: TEXT
 *                     fileUrl:
 *                       type: string
 *                       nullable: true
 *                       example: "https://res.cloudinary.com/demo/image/upload/v1234567890/matrimony/chat/photo.jpg"
 *                     fileName:
 *                       type: string
 *                       nullable: true
 *                       example: "photo.jpg"
 *                     mimeType:
 *                       type: string
 *                       nullable: true
 *                       example: "image/jpeg"
 *                     fileSize:
 *                       type: integer
 *                       nullable: true
 *                       example: 248512
 *                     publicId:
 *                       type: string
 *                       nullable: true
 *                       example: "matrimony/chat/abc123xyz"
 *                     status:
 *                       type: string
 *                       example: SENT
 *                     createdAt:
 *                       type: string
 *                       format: date-time
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
 *                     roomNotFound:
 *                       value: Chat room not found.
 *                     unauthorized:
 *                       value: Unauthorized.
 *                     profileNotFound:
 *                       value: Profile not found.
 *                     interestDeleted:
 *                       value: Interest request has been deleted.
 *                     messageLimit:
 *                       value: You have reached the maximum of 4 messages. Wait until the interest request is accepted.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post("/send-message", authenticate, upload.single("file"), sendMessageController);
/**
 * @swagger
 * /v1/api/chat/get-chats:
 *   get:
 *     summary: Get all logged-in User's Chats with other users
 *     description: Returns all chat rooms of the logged-in user sorted by the latest message.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chats fetched successfully.
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
 *                   example: Chats fetched successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roomId:
 *                         type: string
 *                         example: "6892d4d51c6d6d7c2ab4f501_6892d55f1c6d6d7c2ab4f57a"
 *                       participants:
 *                         type: array
 *                         items:
 *                           type: string
 *                       interestId:
 *                         type: string
 *                         example: "6892d4d51c6d6d7c2ab4f400"
 *                       createdBy:
 *                         type: string
 *                         example: "6892d4d51c6d6d7c2ab4f501"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       messageCounts:
 *                         type: object
 *                         additionalProperties:
 *                           type: integer
 *                       lastMessage:
 *                         type: string
 *                         example: "📷 Photo"
 *                       lastMessageSender:
 *                         type: string
 *                         example: "6892d4d51c6d6d7c2ab4f501"
 *                       lastMessageType:
 *                         type: string
 *                         example: IMAGE
 *                       lastMessageAt:
 *                         type: string
 *                         format: date-time
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get("/get-chats", authenticate, getChatsController);
/**
 * @swagger
 * /v1/api/chat/messages/{roomId}:
 *   get:
 *     summary: Get all chat messages
 *     description: Returns every message exchanged in a chat room.
 *     tags:
 *       - Profile - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a5487a89b2e535513fd7b12_6a5b25cff664b0200235d439
 *     responses:
 *       200:
 *         description: Messages fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Chat room not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/messages/:roomId", authenticate, getAllMyMessages);

export const chatRouter = router;