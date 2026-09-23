"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlinePersonalTipRouter = void 0;
const express_1 = require("express");
const tips_controller_1 = require("./tips.controller");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const cloudinary_1 = require("../../../config/cloudinary");
const router = (0, express_1.Router)();
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
router.post('/', authMiddleware_1.authenticate, cloudinary_1.upload.single('image'), tips_controller_1.createOnlinePersonalTip);
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
router.get('/', tips_controller_1.getOnlinePersonalTips);
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
router.get('/:id', tips_controller_1.getOnlinePersonalTipById);
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
router.put('/:id', authMiddleware_1.authenticate, cloudinary_1.upload.single('image'), tips_controller_1.updateOnlinePersonalTip);
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
router.delete('/:id', authMiddleware_1.authenticate, tips_controller_1.deleteOnlinePersonalTip);
exports.onlinePersonalTipRouter = router;
