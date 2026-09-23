"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.termsConditionsRouter = void 0;
const express_1 = require("express");
const termsConditions_controllers_1 = require("./termsConditions.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
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
router.post("/", authMiddleware_1.authenticate, termsConditions_controllers_1.createOrUpdateTermsConditions);
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
router.get("/", termsConditions_controllers_1.getTermsConditions);
exports.termsConditionsRouter = router;
