"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.religionRouter = void 0;
const express_1 = require("express");
const religion_controllers_1 = require("./religion.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Religion (Admin)
 *   description: Religion Management APIs
 */
/**
 * @swagger
 * /v1/api/admin/religion:
 *   post:
 *     summary: Create a new religion
 *     tags: [Religion (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - religion
 *             properties:
 *               religion:
 *                 type: string
 *                 example: Hindu
 *     responses:
 *       201:
 *         description: Religion created successfully.
 *       400:
 *         description: Validation error.
 *       409:
 *         description: Religion already exists.
 */
router.post("/", authMiddleware_1.authenticate, religion_controllers_1.createReligion);
/**
 * @swagger
 * /v1/api/admin/religion:
 *   get:
 *     summary: Get all religions
 *     tags: [Religion (Admin)]
 *     responses:
 *       200:
 *         description: List of religions.
 */
router.get("/", religion_controllers_1.getReligions);
/**
 * @swagger
 * /v1/api/admin/religion/{id}:
 *   get:
 *     summary: Get religion by ID
 *     tags: [Religion (Admin)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Religion ID
 *     responses:
 *       200:
 *         description: Religion fetched successfully.
 *       404:
 *         description: Religion not found.
 */
router.get("/:id", religion_controllers_1.getReligionById);
/**
 * @swagger
 * /v1/api/admin/religion/{id}:
 *   put:
 *     summary: Update religion
 *     tags: [Religion (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Religion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               religion:
 *                 type: string
 *                 example: Muslim
 *     responses:
 *       200:
 *         description: Religion updated successfully.
 *       404:
 *         description: Religion not found.
 *       409:
 *         description: Religion already exists.
 */
router.put("/:id", authMiddleware_1.authenticate, religion_controllers_1.updateReligion);
/**
 * @swagger
 * /v1/api/admin/religion/{id}:
 *   patch:
 *     summary: Delete religion (Soft Delete)
 *     tags: [Religion (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Religion ID
 *     responses:
 *       200:
 *         description: Religion deleted successfully.
 *       404:
 *         description: Religion not found.
 */
router.patch("/:id", authMiddleware_1.authenticate, religion_controllers_1.deleteReligion);
exports.religionRouter = router;
