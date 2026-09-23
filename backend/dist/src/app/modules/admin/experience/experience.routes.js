"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.experienceRouter = void 0;
const express_1 = require("express");
const experience_controllers_1 = require("./experience.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Experience
 *   description: Experience section APIs
 */
/**
 * @swagger
 * /v1/api/admin/experience:
 *   post:
 *     summary: Create experience
 *     tags: [Experience]
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
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "30 Day Money Back Guarantee"
 *               description:
 *                 type: string
 *                 example: "Get matched with someone special within 30 days, or we'll refund your money—guaranteed!"
 *               icon:
 *                 type: string
 *                 example: "money-back"
 *               sortOrder:
 *                 type: number
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Experience created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware_1.authenticate, experience_controllers_1.createExperience);
/**
 * @swagger
 * /v1/api/admin/experience:
 *   get:
 *     summary: Get all experiences
 *     tags: [Experience]
 *     responses:
 *       200:
 *         description: Experiences fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", experience_controllers_1.getExperiences);
/**
 * @swagger
 * /v1/api/admin/experience/{id}:
 *   get:
 *     summary: Get experience by ID
 *     tags: [Experience]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "68b123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Experience fetched successfully
 *       400:
 *         description: Invalid experience ID
 *       404:
 *         description: Experience not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", experience_controllers_1.getExperienceById);
/**
 * @swagger
 * /v1/api//admin/experience/{id}:
 *   put:
 *     summary: Update experience by ID
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "68b123456789abcdef123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "30 Day Money Back Guarantee"
 *               description:
 *                 type: string
 *                 example: "Get matched with someone special within 30 days, or we'll refund your money—guaranteed!"
 *               icon:
 *                 type: string
 *                 example: "money-back"
 *               sortOrder:
 *                 type: number
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Experience updated successfully
 *       400:
 *         description: Invalid ID or validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Experience not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authMiddleware_1.authenticate, experience_controllers_1.updateExperience);
/**
 * @swagger
 * /v1/api/admin/experience/{id}:
 *   delete:
 *     summary: Delete experience by ID
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "68b123456789abcdef123456"
 *     responses:
 *       200:
 *         description: Experience deleted successfully
 *       400:
 *         description: Invalid experience ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Experience not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware_1.authenticate, experience_controllers_1.deleteExperience);
exports.experienceRouter = router;
