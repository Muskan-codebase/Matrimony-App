"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqRouter = void 0;
const express_1 = require("express");
const faq_controllers_1 = require("./faq.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: FAQs
 *   description: FAQ Management APIs
 */
/**
 * @swagger
 * /v1/api/faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *                 example: "How do I create a profile?"
 *               answer:
 *                 type: string
 *                 example: "Sign up using your mobile number and complete your profile."
 *               displayOrder:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: FAQ created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.post("/", authMiddleware_1.authenticate, faq_controllers_1.createFAQ);
/**
 * @swagger
 * /v1/api/faqs/{id}:
 *   put:
 *     summary: Update FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: FAQ ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "How can I edit my profile?"
 *               answer:
 *                 type: string
 *                 example: "Go to Profile > Edit Profile."
 *               displayOrder:
 *                 type: integer
 *                 example: 2
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: FAQ updated successfully.
 *       404:
 *         description: FAQ not found.
 *       401:
 *         description: Unauthorized.
 */
router.put("/:id", authMiddleware_1.authenticate, faq_controllers_1.updateFAQ);
/**
 * @swagger
 * /v1/api/faqs:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: FAQs fetched successfully.
 */
router.get("/", faq_controllers_1.getFAQs);
/**
 * @swagger
 * /v1/api/faqs/{id}:
 *   get:
 *     summary: Get FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: FAQ ID
 *     responses:
 *       200:
 *         description: FAQ fetched successfully.
 *       404:
 *         description: FAQ not found.
 */
router.get("/:id", faq_controllers_1.getFAQById);
/**
 * @swagger
 * /v1/api/faqs/{id}:
 *   patch:
 *     summary: Delete FAQ (Soft Delete)
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: FAQ ID
 *     responses:
 *       200:
 *         description: FAQ deleted successfully.
 *       404:
 *         description: FAQ not found.
 *       401:
 *         description: Unauthorized.
 */
router.patch("/:id", authMiddleware_1.authenticate, faq_controllers_1.deleteFAQ);
exports.faqRouter = router;
