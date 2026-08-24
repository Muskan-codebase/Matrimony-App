"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privacyPolicyRouter = void 0;
const express_1 = require("express");
const privacyPolicy_controllers_1 = require("./privacyPolicy.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /v1/api/admin/privacy-policy:
 *   post:
 *     summary: Create or Update Privacy Policy
 *     tags: [Privacy Policy (Admin)]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Creates the Privacy Policy if it does not exist.
 *       If the Privacy Policy already exists, updates the existing content.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "At SahaJeevan, we respect your privacy and are committed to protecting your personal information. We collect and use your information to provide secure and reliable matrimonial services."
 *     responses:
 *       200:
 *         description: Privacy Policy created or updated successfully
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
 *                   example: "Privacy Policy saved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68a123456789abcdef123456"
 *                     content:
 *                       type: string
 *                       example: "At SahaJeevan, we respect your privacy and are committed to protecting your personal information."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to save Privacy Policy
 */
router.post("/", authMiddleware_1.authenticate, privacyPolicy_controllers_1.createOrUpdatePrivacyPolicy);
/**
 * @swagger
 * /v1/api/admin/privacy-policy:
 *   get:
 *     summary: Get Privacy Policy
 *     tags: [Privacy Policy (Admin)]
 *     description: Retrieves the current Privacy Policy content.
 *     responses:
 *       200:
 *         description: Privacy Policy fetched successfully
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
 *                   example: "Privacy Policy fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68a123456789abcdef123456"
 *                     content:
 *                       type: string
 *                       example: "At SahaJeevan, we respect your privacy and are committed to protecting your personal information."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Privacy Policy not found
 *       500:
 *         description: Failed to fetch Privacy Policy
 */
router.get("/", privacyPolicy_controllers_1.getPrivacyPolicy);
exports.privacyPolicyRouter = router;
