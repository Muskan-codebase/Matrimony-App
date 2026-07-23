"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.annualIncomeRouter = void 0;
const express_1 = require("express");
const annualIncome_controllers_1 = require("./annualIncome.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Annual Income (Admin)
 *   description: APIs for managing annual income options.
 */
/**
 * @swagger
 * /v1/api/admin/annual-income:
 *   post:
 *     summary: Create a new annual income
 *     tags: [Annual Income (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - annualIncome
 *               - minIncome
 *             properties:
 *               annualIncome:
 *                 type: string
 *                 example: ₹ 5 Lakhs to 7 Lakhs
 *               minIncome:
 *                 type: number
 *                 example: 500000
 *               maxIncome:
 *                 type: number
 *                 nullable: true
 *                 example: 700000
 *     responses:
 *       201:
 *         description: Annual income created successfully.
 *       400:
 *         description: Bad request.
 */
router.post("/", authMiddleware_1.authenticate, annualIncome_controllers_1.createAnnualIncome);
/**
 * @swagger
 * /v1/api/admin/annual-income:
 *   get:
 *     summary: Get all annual income options
 *     tags: [Annual Income (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all annual income options.
 */
router.get("/", authMiddleware_1.authenticate, annualIncome_controllers_1.getAnnualIncomes);
/**
 * @swagger
 * /v1/api/admin/annual-income/{id}:
 *   get:
 *     summary: Get annual income by ID
 *     tags: [Annual Income (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Annual Income ID
 *     responses:
 *       200:
 *         description: Annual income retrieved successfully.
 *       404:
 *         description: Annual income not found.
 */
router.get("/:id", authMiddleware_1.authenticate, annualIncome_controllers_1.getAnnualIncomeById);
/**
 * @swagger
 * /v1/api/admin/annual-income/{id}:
 *   put:
 *     summary: Update annual income
 *     tags: [Annual Income (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Annual Income ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               annualIncome:
 *                 type: string
 *                 example: ₹ 7 Lakhs to 10 Lakhs
 *               minIncome:
 *                 type: number
 *                 example: 700000
 *               maxIncome:
 *                 type: number
 *                 nullable: true
 *                 example: 1000000
 *     responses:
 *       200:
 *         description: Annual income updated successfully.
 *       404:
 *         description: Annual income not found.
 */
router.put("/:id", authMiddleware_1.authenticate, annualIncome_controllers_1.updateAnnualIncome);
/**
 * @swagger
 * /v1/api/admin/annual-income/{id}:
 *   patch:
 *     summary: Delete annual income (Soft Delete)
 *     tags: [Annual Income (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Annual Income ID
 *     responses:
 *       200:
 *         description: Annual income deleted successfully.
 *       404:
 *         description: Annual income not found.
 */
router.patch("/:id", authMiddleware_1.authenticate, annualIncome_controllers_1.deleteAnnualIncome);
exports.annualIncomeRouter = router;
