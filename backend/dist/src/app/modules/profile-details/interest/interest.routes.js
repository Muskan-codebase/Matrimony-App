"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interestRouter = void 0;
const express_1 = require("express");
const interest_controllers_1 = require("./interest.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Profile - Interest
 *   description: Endpoints for sending, receiving, accepting, rejecting, and withdrawing matrimonial interests between member profiles.
 */
/**
 * @swagger
 * /v1/api/interest:
 *   post:
 *     summary: Send interest to another profile
 *     tags: [Profile - Interest]
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
 *                 example: 66a1234567890abcdef12345
 *     responses:
 *       201:
 *         description: Interest sent successfully.
 *       400:
 *         description: Validation error or cannot send interest to yourself.
 *       409:
 *         description: Interest already sent.
 */
router.post("/", authMiddleware_1.authenticate, interest_controllers_1.sendInterest);
/**
 * @swagger
 * /v1/api/interest/sent:
 *   get:
 *     summary: Get all sent interests
 *     tags: [Profile - Interest]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sent interests retrieved successfully.
 */
router.get("/sent", authMiddleware_1.authenticate, interest_controllers_1.getSentInterests);
/**
 * @swagger
 * /v1/api/interest/received:
 *   get:
 *     summary: Get all received interests
 *     tags: [Profile - Interest]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Received interests retrieved successfully.
 */
router.get("/received", authMiddleware_1.authenticate, interest_controllers_1.getReceivedInterests);
/**
 * @swagger
 * /v1/api/interest/{id}/accept:
 *   patch:
 *     summary: Accept a received interest
 *     tags: [Profile - Interest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Interest ID
 *     responses:
 *       200:
 *         description: Interest accepted successfully.
 *       404:
 *         description: Interest not found.
 */
router.patch("/:id/accept", authMiddleware_1.authenticate, interest_controllers_1.acceptInterest);
/**
 * @swagger
 * /v1/api/interest/{id}/reject:
 *   patch:
 *     summary: Reject a received interest
 *     tags: [Profile - Interest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Interest ID
 *     responses:
 *       200:
 *         description: Interest rejected successfully.
 *       404:
 *         description: Interest not found.
 */
router.patch("/:id/reject", authMiddleware_1.authenticate, interest_controllers_1.rejectInterest);
/**
 * @swagger
 * /v1/api/interest/{id}/withdraw:
 *   patch:
 *     summary: Withdraw a sent interest
 *     tags: [Profile - Interest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Interest ID
 *     responses:
 *       200:
 *         description: Interest withdrawn successfully.
 *       404:
 *         description: Interest not found.
 */
router.patch("/:id/withdraw", authMiddleware_1.authenticate, interest_controllers_1.withdrawInterest);
exports.interestRouter = router;
