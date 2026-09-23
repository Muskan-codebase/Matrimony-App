import { Router } from "express";
import {
    createOrUpdateCounter,
    getCounter,
} from "./counter.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Counter
 *   description: Counter management APIs
 */

/**
 * @swagger
 * /v1/api/admin/counter:
 *   post:
 *     summary: Create or update counter
 *     tags: [Counter]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileVerifiedProfiles
 *               - customersServed
 *               - successfulMatchmakingYears
 *             properties:
 *               mobileVerifiedProfiles:
 *                 type: string
 *                 example: "10,000+"
 *               customersServed:
 *                 type: string
 *                 example: "5,000+"
 *               successfulMatchmakingYears:
 *                 type: string
 *                 example: "10+"
 *     responses:
 *       200:
 *         description: Counter created or updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticate, createOrUpdateCounter);
/**
 * @swagger
 * /v1/api/admin/counter:
 *   get:
 *     summary: Get counter
 *     tags: [Counter]
 *     responses:
 *       200:
 *         description: Counter fetched successfully
 *       404:
 *         description: Counter not found
 *       500:
 *         description: Internal server error
 */
router.get("/", getCounter);

export const counterRouter = router;