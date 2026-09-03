import { Router } from "express";
import {
    createPress,
    getPress,
    getPressById,
    updatePress,
    deletePress,
} from "./press.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";
import { upload } from "../../../config/cloudinary";

const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Press
 *     description: APIs for managing press articles
 */

/**
 * @swagger
 * /v1/api/admin/press:
 *   post:
 *     summary: Create a press article
 *     description: Creates a new press article with publication details, article information, and an image.
 *     tags:
 *       - Press
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - publication
 *               - date
 *               - image
 *               - title
 *               - description
 *               - articleUrl
 *             properties:
 *               publication:
 *                 type: string
 *                 example: The Times of India
 *               date:
 *                 type: string
 *                 example: 2026-09-03
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: SahaJeevan Makes Matrimony Safer and Smarter
 *               description:
 *                 type: string
 *                 example: SahaJeevan introduces new features to make online matchmaking safer and more reliable.
 *               articleUrl:
 *                 type: string
 *                 example: https://example.com/sahajeevan-article
 *     responses:
 *       201:
 *         description: Press article created successfully
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
 *                   example: Press article created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68b7a1c2e45f123456789abc
 *                     publication:
 *                       type: string
 *                       example: The Times of India
 *                     date:
 *                       type: string
 *                       example: 2026-09-03
 *                     image:
 *                       type: string
 *                       example: https://res.cloudinary.com/example/image/upload/press/article.jpg
 *                     title:
 *                       type: string
 *                       example: SahaJeevan Makes Matrimony Safer and Smarter
 *                     description:
 *                       type: string
 *                       example: SahaJeevan introduces new features to make online matchmaking safer and more reliable.
 *                     articleUrl:
 *                       type: string
 *                       example: https://example.com/sahajeevan-article
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation failed or image is missing
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
 *                   example: Press image is required
 *                 errors:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create press article
 */
router.post("/", authenticate, upload.single("image"), createPress);
/**
 * @swagger
 * /v1/api/admin/press:
 *   get:
 *     summary: Get all press articles
 *     description: Fetches all press articles sorted by the latest created article first.
 *     tags:
 *       - Press
 *     responses:
 *       200:
 *         description: Press articles fetched successfully
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
 *                   example: Press articles fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 68b7a1c2e45f123456789abc
 *                       publication:
 *                         type: string
 *                         example: The Times of India
 *                       date:
 *                         type: string
 *                         example: 2026-09-03
 *                       image:
 *                         type: string
 *                         example: https://res.cloudinary.com/example/image/upload/press/article.jpg
 *                       title:
 *                         type: string
 *                         example: SahaJeevan Makes Matrimony Safer and Smarter
 *                       description:
 *                         type: string
 *                         example: SahaJeevan introduces new features to make online matchmaking safer and more reliable.
 *                       articleUrl:
 *                         type: string
 *                         example: https://example.com/sahajeevan-article
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Failed to fetch press articles
 */
router.get("/", getPress);
/**
 * @swagger
 * /v1/api/admin/press/{id}:
 *   get:
 *     summary: Get press article by ID
 *     description: Fetches a single press article using its ID.
 *     tags:
 *       - Press
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Press article ID
 *         example: 68b7a1c2e45f123456789abc
 *     responses:
 *       200:
 *         description: Press article fetched successfully
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
 *                   example: Press article fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68b7a1c2e45f123456789abc
 *                     publication:
 *                       type: string
 *                       example: The Times of India
 *                     date:
 *                       type: string
 *                       example: 2026-09-03
 *                     image:
 *                       type: string
 *                       example: https://res.cloudinary.com/example/image/upload/press/article.jpg
 *                     title:
 *                       type: string
 *                       example: SahaJeevan Makes Matrimony Safer and Smarter
 *                     description:
 *                       type: string
 *                       example: SahaJeevan introduces new features to make online matchmaking safer and more reliable.
 *                     articleUrl:
 *                       type: string
 *                       example: https://example.com/sahajeevan-article
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid press article ID
 *       404:
 *         description: Press article not found
 *       500:
 *         description: Failed to fetch press article
 */
router.get("/:id", getPressById);
/**
 * @swagger
 * /v1/api/admin/press/{id}:
 *   put:
 *     summary: Update a press article
 *     description: Updates an existing press article. A new image can optionally be uploaded.
 *     tags:
 *       - Press
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Press article ID
 *         example: 68b7a1c2e45f123456789abc
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               publication:
 *                 type: string
 *                 example: The Times of India
 *               date:
 *                 type: string
 *                 example: 2026-09-03
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: Updated SahaJeevan Press Article
 *               description:
 *                 type: string
 *                 example: Updated description for the press article.
 *               articleUrl:
 *                 type: string
 *                 example: https://example.com/updated-sahajeevan-article
 *     responses:
 *       200:
 *         description: Press article updated successfully
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
 *                   example: Press article updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68b7a1c2e45f123456789abc
 *                     publication:
 *                       type: string
 *                       example: The Times of India
 *                     date:
 *                       type: string
 *                       example: 2026-09-03
 *                     image:
 *                       type: string
 *                       example: https://res.cloudinary.com/example/image/upload/press/article.jpg
 *                     title:
 *                       type: string
 *                       example: Updated SahaJeevan Press Article
 *                     description:
 *                       type: string
 *                       example: Updated description for the press article.
 *                     articleUrl:
 *                       type: string
 *                       example: https://example.com/updated-sahajeevan-article
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation failed or invalid press article ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Press article not found
 *       500:
 *         description: Failed to update press article
 */
router.put("/:id", authenticate, upload.single("image"), updatePress);
/**
 * @swagger
 * /v1/api/admin/press/{id}:
 *   delete:
 *     summary: Delete a press article
 *     description: Permanently deletes a press article using its ID.
 *     tags:
 *       - Press
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Press article ID
 *         example: 68b7a1c2e45f123456789abc
 *     responses:
 *       200:
 *         description: Press article deleted successfully
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
 *                   example: Press article deleted successfully
 *       400:
 *         description: Invalid press article ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Press article not found
 *       500:
 *         description: Failed to delete press article
 */
router.delete("/:id", authenticate, deletePress);

export const pressRouter = router;