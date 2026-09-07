"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.counterRouter = void 0;
const express_1 = require("express");
const counter_controllers_1 = require("./counter.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
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
router.post("/", authMiddleware_1.authenticate, counter_controllers_1.createOrUpdateCounter);
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
router.get("/", counter_controllers_1.getCounter);
exports.counterRouter = router;
