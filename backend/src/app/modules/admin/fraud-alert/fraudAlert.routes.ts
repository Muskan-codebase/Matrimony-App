import { Router } from "express";
import {
    createOrUpdateFraudAlert,
    getFraudAlert,
} from "./fraudAlert.controller";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Fraud Alert
 *     description: APIs for managing Fraud & Alert content
 */

/**
 * @swagger
 * /v1/api/admin/fraud-alert:
 *   post:
 *     summary: Create or update Fraud & Alert
 *     description: Creates the Fraud & Alert content if it does not exist, or updates the existing content.
 *     tags:
 *       - Fraud Alert
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Your Fraud & Alert
 *               content:
 *                 type: string
 *                 example: We value your trust and are committed to protecting your personal information.
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Fraud & Alert saved successfully
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
 *                   example: Fraud & Alert saved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68b7a1c2e45f123456789abc
 *                     title:
 *                       type: string
 *                       example: Your Fraud & Alert
 *                     content:
 *                       type: string
 *                       example: We value your trust and are committed to protecting your personal information.
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation failed
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
 *                   example: Validation failed
 *                 errors:
 *                   type: object
 *       500:
 *         description: Failed to save Fraud & Alert
 */
router.post("/", authenticate, createOrUpdateFraudAlert);
/**
 * @swagger
 * /v1/api/admin/fraud-alert:
 *   get:
 *     summary: Get Fraud & Alert
 *     description: Fetches the existing Fraud & Alert content.
 *     tags:
 *       - Fraud Alert
 *     responses:
 *       200:
 *         description: Fraud & Alert fetched successfully
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
 *                   example: Fraud & Alert fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68b7a1c2e45f123456789abc
 *                     title:
 *                       type: string
 *                       example: Your Fraud & Alert
 *                     content:
 *                       type: string
 *                       example: We value your trust and are committed to protecting your personal information.
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Fraud & Alert not found
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
 *                   example: Fraud & Alert not found
 *       500:
 *         description: Failed to fetch Fraud & Alert
 */
router.get("/", getFraudAlert);

export const fraudAlertRouter = router;