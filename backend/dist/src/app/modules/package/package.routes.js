"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageRouter = void 0;
const express_1 = __importDefault(require("express"));
const package_controllers_1 = require("./package.controllers");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   - name: Packages (Admin)
 *     description: APIs for administrators to create, manage, update, retrieve, and delete membership packages.
 */
/**
 * @swagger
 * /v1/api/admin/package:
 *   post:
 *     summary: Create a new membership package
 *     tags: [Packages (Admin)]
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
 *               - description
 *               - duration
 *               - durationType
 *               - price
 *               - features
 *               - interestRequestLimit
 *               - dailyInterestRequestLimit
 *             properties:
 *               title:
 *                 type: string
 *                 example: Gold
 *               description:
 *                 type: string
 *                 example: Gold membership package
 *               duration:
 *                 type: number
 *                 example: 3
 *               durationType:
 *                 type: string
 *                 enum: [DAY, MONTH, YEAR]
 *                 example: MONTH
 *               price:
 *                 type: number
 *                 example: 5500
 *               originalPrice:
 *                 type: number
 *                 example: 7500
 *               discountPercentage:
 *                 type: number
 *                 example: 27
 *               badge:
 *                 type: string
 *                 example: Popular
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Valid for 3 months
 *                   - View 50 phone numbers
 *                   - Unlimited messages
 *               interestRequestLimit:
 *                 type: number
 *                 minimum: 0
 *                 example: 50
 *               dailyInterestRequestLimit:
 *                 type: number
 *                 minimum: 0
 *                 example: 8
 *               displayOrder:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Package created successfully.
 *       400:
 *         description: Validation error or package already exists.
 *       401:
 *         description: Unauthorized.
 */
router.post("/", authMiddleware_1.authenticate, package_controllers_1.createPackage);
/**
 * @swagger
 * /v1/api/admin/package:
 *   get:
 *     summary: Get all active membership packages
 *     tags: [Packages (Admin)]
 *     responses:
 *       200:
 *         description: Packages retrieved successfully.
 *       400:
 *         description: Bad request.
 */
router.get("/", package_controllers_1.getPackages);
/**
 * @swagger
 * /v1/api/admin/package/{id}:
 *   get:
 *     summary: Get a membership package by ID
 *     tags: [Packages (Admin)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "68720b8de2b2d1b8f5f9a321"
 *     responses:
 *       200:
 *         description: Package retrieved successfully.
 *       404:
 *         description: Package not found.
 */
router.get("/:id", package_controllers_1.getPackageById);
/**
 * @swagger
 * /v1/api/admin/package/{id}:
 *   put:
 *     summary: Update a membership package
 *     tags: [Packages (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "68720b8de2b2d1b8f5f9a321"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Gold
 *               description:
 *                 type: string
 *                 example: Gold membership package
 *               duration:
 *                 type: number
 *                 example: 3
 *               durationType:
 *                 type: string
 *                 enum: [DAY, MONTH, YEAR]
 *                 example: MONTH
 *               price:
 *                 type: number
 *                 example: 5500
 *               originalPrice:
 *                 type: number
 *                 example: 7500
 *               discountPercentage:
 *                 type: number
 *                 example: 27
 *               badge:
 *                 type: string
 *                 example: Popular
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Valid for 3 months
 *                   - View 50 phone numbers
 *                   - Unlimited messages
 *               interestRequestLimit:
 *                 type: number
 *                 minimum: 0
 *                 example: 50
 *               dailyInterestRequestLimit:
 *                 type: number
 *                 minimum: 0
 *                 example: 8
 *               isDeleted:
 *                 type: boolean
 *                 example: false
 *               displayOrder:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Package updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Package not found.
 */
router.put("/:id", authMiddleware_1.authenticate, package_controllers_1.updatePackage);
/**
 * @swagger
 * /v1/api/admin/package/{id}:
 *   delete:
 *     summary: Delete (deactivate) a membership package
 *     tags: [Packages (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "68720b8de2b2d1b8f5f9a321"
 *     responses:
 *       200:
 *         description: Package deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Package not found.
 */
router.delete("/:id", authMiddleware_1.authenticate, package_controllers_1.deletePackage);
exports.packageRouter = router;
