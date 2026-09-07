"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpCenterRouter = void 0;
const express_1 = require("express");
const helpCenter_controllers_1 = require("./helpCenter.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /v1/api/admin/help-center:
 *   post:
 *     summary: Create Help Center
 *     tags: [Help Center]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Profile & Account
 *               description:
 *                 type: string
 *                 example: Help related to profile and account.
 *               icon:
 *                 type: string
 *                 example: profile
 *               displayOrder:
 *                 type: number
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Help Center created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware_1.authenticate, helpCenter_controllers_1.createHelpCenter);
/**
 * @swagger
 * /v1/api/admin/help-center:
 *   get:
 *     summary: Get all Help Center
 *     tags: [Help Center]
 *     responses:
 *       200:
 *         description: Help Center fetched successfully
 */
router.get("/", helpCenter_controllers_1.getAllHelpCenter);
/**
 * @swagger
 * /v1/api/admin/help-center/{id}:
 *   get:
 *     summary: Get Help Center by ID
 *     tags: [Help Center]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68bb12345678901234567890
 *     responses:
 *       200:
 *         description: Help Center fetched successfully
 *       404:
 *         description: Help Center not found
 */
router.get("/:id", helpCenter_controllers_1.getHelpCentreById);
/**
 * @swagger
 * /v1/api/admin/help-center/{id}:
 *   put:
 *     summary: Update Help Center
 *     tags: [Help Center]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68bb12345678901234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Profile & Account
 *               description:
 *                 type: string
 *                 example: Help related to profile and account.
 *               icon:
 *                 type: string
 *                 example: profile
 *               displayOrder:
 *                 type: number
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Help Center updated successfully
 *       404:
 *         description: Help Center not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware_1.authenticate, helpCenter_controllers_1.updateHelpCentre);
/**
 * @swagger
 * /v1/api/admin/help-center/{id}:
 *   delete:
 *     summary: Delete Help Center
 *     tags: [Help Center]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68bb12345678901234567890
 *     responses:
 *       200:
 *         description: Help Center deleted successfully
 *       404:
 *         description: Help Center not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authMiddleware_1.authenticate, helpCenter_controllers_1.deleteHelpCentre);
exports.helpCenterRouter = router;
