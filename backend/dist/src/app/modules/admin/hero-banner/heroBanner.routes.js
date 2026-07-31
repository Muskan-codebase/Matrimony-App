"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroBannerRouter = void 0;
const express_1 = require("express");
const cloudinary_1 = require("../../../config/cloudinary");
const heroBanner_controllers_1 = require("./heroBanner.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Hero Banner
 *   description: Hero Banner Management APIs
 */
/**
 * @swagger
 * /v1/api/hero-banner:
 *   post:
 *     summary: Create Hero Banner
 *     tags: [Hero Banner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - badge
 *               - title
 *               - description
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               badge:
 *                 type: string
 *                 example: "India's Most Trusted Matrimony Service"
 *               title:
 *                 type: string
 *                 example: "Every Love Story Begins With Trust"
 *               description:
 *                 type: string
 *                 example: "Join millions of members who found their perfect life partner."
 *               displayOrder:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Hero Banner created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.post("/", authMiddleware_1.authenticate, cloudinary_1.upload.single("image"), heroBanner_controllers_1.createBanner);
/**
 * @swagger
 * /v1/api/hero-banner:
 *   get:
 *     summary: Get All Hero Banners
 *     tags: [Hero Banner]
 *     responses:
 *       200:
 *         description: Hero banners fetched successfully.
 */
router.get("/", heroBanner_controllers_1.getBanners);
/**
 * @swagger
 * /v1/api/hero-banner/{id}:
 *   get:
 *     summary: Get Hero Banner by ID
 *     tags: [Hero Banner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hero Banner ID
 *     responses:
 *       200:
 *         description: Hero banner fetched successfully.
 *       404:
 *         description: Hero banner not found.
 */
router.get("/:id", heroBanner_controllers_1.getBanner);
/**
 * @swagger
 * /v1/api/hero-banner/{id}:
 *   put:
 *     summary: Update Hero Banner
 *     tags: [Hero Banner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hero Banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               badge:
 *                 type: string
 *                 example: "India's Most Trusted Matrimony Service"
 *               title:
 *                 type: string
 *                 example: "Every Love Story Begins With Trust"
 *               description:
 *                 type: string
 *                 example: "Join millions of members who found their perfect life partner."
 *               displayOrder:
 *                 type: integer
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Hero Banner updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Hero Banner not found.
 */
router.put("/:id", authMiddleware_1.authenticate, cloudinary_1.upload.single("image"), heroBanner_controllers_1.updateBanner);
/**
 * @swagger
 * /v1/api/hero-banner/{id}:
 *   delete:
 *     summary: Delete Hero Banner
 *     tags: [Hero Banner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hero Banner ID
 *     responses:
 *       200:
 *         description: Hero Banner deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Hero Banner not found.
 */
router.delete("/:id", authMiddleware_1.authenticate, heroBanner_controllers_1.deleteBanner);
exports.heroBannerRouter = router;
