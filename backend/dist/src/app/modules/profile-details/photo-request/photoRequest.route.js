"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoRequestRouter = void 0;
const express_1 = require("express");
const photoRequest_controller_1 = require("./photoRequest.controller");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /v1/api/profile/photo-request:
 *   post:
 *     summary: Request Photo
 *     description: Sends a photo request email to a user who has not uploaded a photo.
 *     tags:
 *       - Profile - Photo Request
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
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: User ID of the profile whose photo is being requested.
 *                 example: "64f1a2b3c4d5e6f789012345"
 *     responses:
 *       200:
 *         description: Photo request sent successfully.
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
 *                   example: Photo request sent successfully
 *
 *       400:
 *         description: Bad request.
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
 *                   example: Receiver ID is required
 *
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
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
 *                   example: Unauthorized
 *
 *       404:
 *         description: Sender or receiver profile not found.
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
 *                   example: Receiver profile not found
 *
 *       500:
 *         description: Failed to send photo request.
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
 *                   example: Failed to send photo request
 */
router.post("/photo-request", authMiddleware_1.authenticate, photoRequest_controller_1.sendPhotoRequest);
exports.photoRequestRouter = router;
