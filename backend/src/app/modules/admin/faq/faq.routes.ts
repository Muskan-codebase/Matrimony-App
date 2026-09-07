import { Router } from "express";
import {
    createFAQ,
    getFAQs,
    getFAQById,
    updateFAQ,
    deleteFAQ,
} from "./faq.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * /v1/api/admin/faqs:
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
 *               - helpCenterId
 *               - question
 *               - answer
 *             properties:
 *               helpCenterId:
 *                 type: string
 *                 example: "68bb12345678901234567890"
 *                 description: Help Center ID
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
router.post("/", authenticate, createFAQ);
/**
 * @swagger
 * /v1/api/admin/faqs/{id}:
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
 *               helpCenterId:
 *                 type: string
 *                 example: "68bb12345678901234567890"
 *                 description: Help Center ID
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
 *       400:
 *         description: Validation error.
 *       404:
 *         description: FAQ not found.
 *       401:
 *         description: Unauthorized.
 */
router.put("/:id", authenticate, updateFAQ);
/**
 * @swagger
 * /v1/api/admin/faqs:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: FAQs fetched successfully.
 */
router.get("/", getFAQs);
/**
 * @swagger
 * /v1/api/admin/faqs/{id}:
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
router.get("/:id", getFAQById);
/**
 * @swagger
 * /v1/api/admin/faqs/{id}:
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
router.patch("/:id", authenticate, deleteFAQ);

export const faqRouter = router;