"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heightRouter = void 0;
const express_1 = require("express");
const height_controllers_1 = require("./height.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Height (Admin)
 *   description: Height management APIs
 */
/**
 * @swagger
 * /v1/api/admin/height:
 *   post:
 *     summary: Create Height
 *     description: Creates a new height option that can be used in the matrimony profile height dropdown.
 *     tags: [Height (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - height
 *             properties:
 *               height:
 *                 type: string
 *                 example: "5'8\""
 *     responses:
 *       201:
 *         description: Height created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       409:
 *         description: Height already exists.
 */
router.post("/", authMiddleware_1.authenticate, height_controllers_1.createHeight);
/**
 * @swagger
 * /v1/api/admin/height:
 *   get:
 *     summary: Get All Heights
 *     description: Retrieves all available height options for the matrimony profile height dropdown.
 *     tags: [Height (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Heights retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/", height_controllers_1.getHeights);
/**
 * @swagger
 * /v1/api/admin/height/{id}:
 *   get:
 *     summary: Get Height By ID
 *     description: Retrieves a specific height option by its ID.
 *     tags: [Height (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Height ID
 *     responses:
 *       200:
 *         description: Height retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Height not found.
 */
router.get("/:id", height_controllers_1.getHeightById);
/**
 * @swagger
 * /v1/api/admin/height/{id}:
 *   put:
 *     summary: Update Height
 *     description: Updates an existing height option used in the matrimony profile height dropdown.
 *     tags: [Height (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Height ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: string
 *                 example: "5'9\""
 *     responses:
 *       200:
 *         description: Height updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Height not found.
 */
router.put("/:id", authMiddleware_1.authenticate, height_controllers_1.updateHeight);
/**
 * @swagger
 * /v1/api/admin/height/{id}:
 *   patch:
 *     summary: Delete Height
 *     description: Soft deletes a height option by marking it as deleted.
 *     tags: [Height (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Height ID
 *     responses:
 *       200:
 *         description: Height deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Height not found.
 */
router.patch("/:id", authMiddleware_1.authenticate, height_controllers_1.deleteHeight);
exports.heightRouter = router;
