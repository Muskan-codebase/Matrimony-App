import { Router } from "express";
import {
    createOrUpdateTermsConditions,
    getTermsConditions,
} from "./termsConditions.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Terms & Conditions
 *     description: Terms & Conditions APIs
 */

/**
 * @swagger
 * /v1/api/admin/terms-conditions:
 *   post:
 *     summary: Create or update Terms & Conditions
 *     tags: [Terms & Conditions]
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
 *                 example: Terms & Conditions
 *               content:
 *                 type: string
 *                 example: These are the terms and conditions...
 *     responses:
 *       200:
 *         description: Terms & Conditions created or updated successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, createOrUpdateTermsConditions);
/**
 * @swagger
 * /v1/api/admin/terms-conditions:
 *   get:
 *     summary: Get Terms & Conditions
 *     tags: [Terms & Conditions]
 *     responses:
 *       200:
 *         description: Terms & Conditions fetched successfully
 */
router.get("/", getTermsConditions);

export const termsConditionsRouter = router;