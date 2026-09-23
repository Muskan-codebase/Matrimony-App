"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successStoryRouter = void 0;
const express_1 = require("express");
const stories_controller_1 = require("./stories.controller");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const cloudinary_1 = require("../../../config/cloudinary");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Success Story
 *   description: Success Story Management APIs
 */
/**
 * @swagger
 * /v1/api/success-stories:
 *   post:
 *     summary: Create Success Story
 *     tags: [Success Story]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - groomName
 *               - brideName
 *               - marriedDate
 *               - location
 *               - story
 *               - year
 *               - image
 *             properties:
 *               groomName:
 *                 type: string
 *                 example: Arun
 *               brideName:
 *                 type: string
 *                 example: Priya
 *               badge:
 *                 type: string
 *                 example: New
 *               marriedDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-01"
 *               location:
 *                 type: string
 *                 example: Pune
 *               story:
 *                 type: string
 *                 example: We met through the platform and got married happily.
 *               year:
 *                 type: integer
 *                 example: 2026
 *               image:
 *                 type: string
 *                 format: binary
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Success story created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.post('/', authMiddleware_1.authenticate, cloudinary_1.upload.single('image'), stories_controller_1.createSuccessStory);
/**
 * @swagger
 * /v1/api/success-stories:
 *   get:
 *     summary: Get All Success Stories
 *     tags: [Success Story]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: Arun
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         example: 2026
 *     responses:
 *       200:
 *         description: Success stories fetched successfully.
 */
router.get('/', stories_controller_1.getSuccessStories);
/**
 * @swagger
 * /v1/api/success-stories/{id}:
 *   get:
 *     summary: Get Success Story By ID
 *     tags: [Success Story]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success story fetched successfully.
 *       404:
 *         description: Success story not found.
 */
router.get('/:id', stories_controller_1.getSuccessStoryById);
/**
 * @swagger
 * /v1/api/success-stories/{id}:
 *   put:
 *     summary: Update Success Story
 *     tags: [Success Story]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               groomName:
 *                 type: string
 *               brideName:
 *                 type: string
 *               badge:
 *                 type: string
 *               marriedDate:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               story:
 *                 type: string
 *               year:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success story updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Success story not found.
 */
router.put('/:id', authMiddleware_1.authenticate, cloudinary_1.upload.single('image'), stories_controller_1.updateSuccessStory);
/**
 * @swagger
 * /v1/api/success-stories/{id}:
 *   delete:
 *     summary: Delete Success Story
 *     tags: [Success Story]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success story deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Success story not found.
 */
router.delete('/:id', authMiddleware_1.authenticate, stories_controller_1.deleteSuccessStory);
exports.successStoryRouter = router;
