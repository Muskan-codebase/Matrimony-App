import { Router } from 'express';
import {
  createOnlinePersonalTip,
  getOnlinePersonalTips,
  getOnlinePersonalTipById,
  updateOnlinePersonalTip,
  deleteOnlinePersonalTip,
} from './tips.controller';
import { authenticate } from '../../../middlewares/authMiddleware';
import { upload } from '../../../config/cloudinary';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Online Personal Tips
 *   description: Online Personal Tips management APIs
 */

/**
 * @swagger
 * /v1/api/admin/online-personal-tips:
 *   post:
 *     summary: Create Online Personal Tip
 *     tags: [Online Personal Tips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - image
 *               - title
 *               - subTitle
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [Personal Tips, Safety Tips, Success Tips, Relationship Tips]
 *                 example: Personal Tips
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 example: Keep your profile updated
 *               subTitle:
 *                 type: string
 *                 example: Fresh profiles get more responses
 *               displayOrder:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Online Personal Tip created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.post('/', authenticate, upload.single('image'), createOnlinePersonalTip);

/**
 * @swagger
 * /v1/api/admin/online-personal-tips:
 *   get:
 *     summary: Get all Online Personal Tips
 *     tags: [Online Personal Tips]
 *     responses:
 *       200:
 *         description: Online Personal Tips fetched successfully.
 */
router.get('/', getOnlinePersonalTips);

/**
 * @swagger
 * /v1/api/admin/online-personal-tips/{id}:
 *   get:
 *     summary: Get Online Personal Tip by ID
 *     tags: [Online Personal Tips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Online Personal Tip ID
 *     responses:
 *       200:
 *         description: Online Personal Tip fetched successfully.
 *       404:
 *         description: Online Personal Tip not found.
 */
router.get('/:id', getOnlinePersonalTipById);

/**
 * @swagger
 * /v1/api/admin/online-personal-tips/{id}:
 *   put:
 *     summary: Update Online Personal Tip
 *     tags: [Online Personal Tips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Online Personal Tip ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [Personal Tips, Safety Tips, Success Tips, Relationship Tips]
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               subTitle:
 *                 type: string
 *               displayOrder:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Online Personal Tip updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Online Personal Tip not found.
 *       401:
 *         description: Unauthorized.
 */
router.put(
  '/:id',
  authenticate,
  upload.single('image'),
  updateOnlinePersonalTip,
);

/**
 * @swagger
 * /v1/api/admin/online-personal-tips/{id}:
 *   delete:
 *     summary: Delete Online Personal Tip (Soft Delete)
 *     tags: [Online Personal Tips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Online Personal Tip ID
 *     responses:
 *       200:
 *         description: Online Personal Tip deleted successfully.
 *       404:
 *         description: Online Personal Tip not found.
 *       401:
 *         description: Unauthorized.
 */
router.delete('/:id', authenticate, deleteOnlinePersonalTip);

export const onlinePersonalTipRouter = router;
