"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.occupationRouter = void 0;
const express_1 = __importDefault(require("express"));
const occupation_controller_1 = require("./occupation.controller");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * /v1/api/admin/occupation:
 *   post:
 *     summary: Create Occupation
 *     tags: [Occupation (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - occupation
 *             properties:
 *               occupation:
 *                 type: string
 *                 example: IT / Software
 *     responses:
 *       201:
 *         description: Occupation created successfully.
 *       400:
 *         description: Validation error.
 *       409:
 *         description: Occupation already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/", authMiddleware_1.authenticate, occupation_controller_1.createOccupation);
/**
 * @swagger
 * /v1/api/admin/occupation:
 *   get:
 *     summary: Get All Occupations
 *     tags: [Occupation (Admin)]
 *     responses:
 *       200:
 *         description: Occupations fetched successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/", occupation_controller_1.getOccupations);
/**
 * @swagger
 * /v1/api/admin/occupation/{id}:
 *   get:
 *     summary: Get Occupation By Id
 *     tags: [Occupation (Admin)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6879a4ab72f2f1d2c1234567
 *     responses:
 *       200:
 *         description: Occupation fetched successfully.
 *       404:
 *         description: Occupation not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", occupation_controller_1.getOccupationById);
/**
 * @swagger
 * /v1/api/admin/occupation/{id}:
 *   put:
 *     summary: Update Occupation
 *     tags: [Occupation (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6879a4ab72f2f1d2c1234567
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - occupation
 *             properties:
 *               occupation:
 *                 type: string
 *                 example: Business / Self Employed
 *     responses:
 *       200:
 *         description: Occupation updated successfully.
 *       404:
 *         description: Occupation not found.
 *       409:
 *         description: Occupation already exists.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", authMiddleware_1.authenticate, occupation_controller_1.updateOccupation);
/**
 * @swagger
 * /v1/api/admin/occupation/{id}:
 *   patch:
 *     summary: Delete Occupation
 *     tags: [Occupation (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6879a4ab72f2f1d2c1234567
 *     responses:
 *       200:
 *         description: Occupation deleted successfully.
 *       404:
 *         description: Occupation not found.
 *       500:
 *         description: Internal server error.
 */
router.patch("/:id", authMiddleware_1.authenticate, occupation_controller_1.deleteOccupation);
exports.occupationRouter = router;
