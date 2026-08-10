import { Router } from "express";
import { createOrUpdateContactUs, getContactUs } from "./contactUs.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * /v1/api/contact-us:
 *   post:
 *     summary: Create or Update Contact Us
 *     tags: [Contact Us (Admin)]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Creates the Contact Us details if they do not exist.
 *       If Contact Us details already exist, updates the existing details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - officeAddress
 *               - email
 *             properties:
 *               officeAddress:
 *                 type: string
 *                 example: "4th Floor, Amar Business Park, Baner Road, Pune, Maharashtra 411045, India"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "support@sahajeevan.com"
 *     responses:
 *       200:
 *         description: Contact Us details created or updated successfully
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
 *                   example: "Contact Us details saved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68a123456789abcdef123456"
 *                     officeAddress:
 *                       type: string
 *                       example: "4th Floor, Amar Business Park, Baner Road, Pune, Maharashtra 411045, India"
 *                     email:
 *                       type: string
 *                       example: "support@sahajeevan.com"
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
 *         description: Failed to save Contact Us details
 */
router.post("/", authenticate, createOrUpdateContactUs);
/**
 * @swagger
 * /v1/api/contact-us:
 *   get:
 *     summary: Get Contact Us
 *     tags: [Contact Us (Admin)]
 *     description: Retrieves the current Contact Us details.
 *     responses:
 *       200:
 *         description: Contact Us details fetched successfully
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
 *                   example: "Contact Us details fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68a123456789abcdef123456"
 *                     officeAddress:
 *                       type: string
 *                       example: "4th Floor, Amar Business Park, Baner Road, Pune, Maharashtra 411045, India"
 *                     email:
 *                       type: string
 *                       example: "support@sahajeevan.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Contact Us details not found
 *       500:
 *         description: Failed to fetch Contact Us details
 */
router.get("/", getContactUs);

export const contactUsRouter = router;