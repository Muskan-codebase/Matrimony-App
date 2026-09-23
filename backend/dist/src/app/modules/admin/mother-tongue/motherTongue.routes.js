"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.motherTongueRouter = void 0;
const express_1 = require("express");
const motherTongue_controller_1 = require("./motherTongue.controller");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Mother Tongue (Admin)
 *   description: Mother Tongue management APIs
 */
/**
 * @swagger
 * /v1/api/admin/mother-tongue:
 *   post:
 *     summary: Create Mother Tongue
 *     tags: [Mother Tongue (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motherTongue
 *             properties:
 *               motherTongue:
 *                 type: string
 *                 example: Hindi
 *     responses:
 *       201:
 *         description: Mother tongue created successfully.
 *       409:
 *         description: Mother tongue already exists.
 */
router.post("/", authMiddleware_1.authenticate, motherTongue_controller_1.createMotherTongue);
/**
 * @swagger
 * /v1/api/admin/mother-tongue:
 *   get:
 *     summary: Get All Mother Tongues
 *     tags: [Mother Tongue (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of mother tongues.
 */
router.get("/", motherTongue_controller_1.getMotherTongues);
/**
 * @swagger
 * /v1/api/admin/mother-tongue/{id}:
 *   get:
 *     summary: Get Mother Tongue By ID
 *     tags: [Mother Tongue (Admin)]
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
 *         description: Mother tongue fetched successfully.
 *       404:
 *         description: Mother tongue not found.
 */
router.get("/:id", motherTongue_controller_1.getMotherTongueById);
/**
 * @swagger
 * /v1/api/admin/mother-tongue/{id}:
 *   patch:
 *     summary: Update Mother Tongue
 *     tags: [Mother Tongue (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motherTongue:
 *                 type: string
 *                 example: Marathi
 *     responses:
 *       200:
 *         description: Mother tongue updated successfully.
 *       404:
 *         description: Mother tongue not found.
 */
router.patch("/:id", authMiddleware_1.authenticate, motherTongue_controller_1.updateMotherTongue);
/**
 * @swagger
 * /v1/api/admin/mother-tongue/{id}:
 *   delete:
 *     summary: Delete Mother Tongue
 *     tags: [Mother Tongue (Admin)]
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
 *         description: Mother tongue deleted successfully.
 *       404:
 *         description: Mother tongue not found.
 */
router.delete("/:id", authMiddleware_1.authenticate, motherTongue_controller_1.deleteMotherTongue);
exports.motherTongueRouter = router;
