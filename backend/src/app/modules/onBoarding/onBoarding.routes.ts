import { Router } from 'express';
import { getOnboarding, updateOnboardingItem } from './onBoarding.controller';
import { upload } from "../../config/cloudinary";

const router = Router();
/**
 * @swagger
 * /v1/api/on-boarding:
 *   get:
 *     summary: Get onboarding content
 *     description: >
 *       Retrieves the onboarding screens displayed to users when they first open
 *       the application. If no onboarding configuration exists, a default set of
 *       three onboarding screens is automatically created and returned.
 *     tags: [Onboarding]
 *     responses:
 *       200:
 *         description: Onboarding content fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f1c2e5b3a1a2b3c4d5e6f7
 *                       title:
 *                         type: string
 *                         example: Find Your Perfect Match
 *                       description:
 *                         type: string
 *                         example: Browse thousands of verified matrimony profiles.
 *                       image:
 *                         type: string
 *                         example: https://res.cloudinary.com/demo/image/upload/onboarding1.png
 *                       status:
 *                         type: string
 *                         enum:
 *                           - Active
 *                           - Inactive
 *                         example: Active
 *       500:
 *         description: Server error while fetching onboarding content.
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
 *                   example: Error fetching onboarding content
 *                 error:
 *                   type: string
 */
router.get('/', getOnboarding);
/**
 * @swagger
 * /v1/api/on-boarding/{itemId}:
 *   patch:
 *     summary: Update an onboarding item
 *     description: >
 *       Updates an existing onboarding screen. Supports partial updates.
 *       Administrators can update the title, description, status, and optionally
 *       upload a new onboarding image. Image uploads are stored in Cloudinary.
 *     tags: [Onboarding]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: ID of the onboarding item.
 *         schema:
 *           type: string
 *         example: 64f1c2e5b3a1a2b3c4d5e6f7
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Find Your Perfect Match
 *               description:
 *                 type: string
 *                 example: Browse thousands of verified matrimony profiles.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Upload a new onboarding image.
 *               status:
 *                 type: string
 *                 enum:
 *                   - Active
 *                   - Inactive
 *                 example: Active
 *     responses:
 *       200:
 *         description: Onboarding item updated successfully.
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
 *                   example: Onboarding item updated successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f1c2e5b3a1a2b3c4d5e6f7
 *                       title:
 *                         type: string
 *                         example: Find Your Perfect Match
 *                       description:
 *                         type: string
 *                         example: Browse thousands of verified matrimony profiles.
 *                       image:
 *                         type: string
 *                         example: https://res.cloudinary.com/demo/image/upload/onboarding1.png
 *                       status:
 *                         type: string
 *                         enum:
 *                           - Active
 *                           - Inactive
 *                         example: Active
 *       400:
 *         description: Validation error.
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
 *                   example: Validation error
 *                 errors:
 *                   type: string
 *       404:
 *         description: Onboarding item not found.
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
 *                   example: Onboarding item not found
 *       500:
 *         description: Server error while updating onboarding item.
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
 *                   example: Error updating onboarding item
 *                 error:
 *                   type: string
 */
router.patch('/:itemId', upload.single("image"), updateOnboardingItem);

export const onboardingRoutes = router;
