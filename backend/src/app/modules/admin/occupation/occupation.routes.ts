import express from "express";
import {
    createOccupation,
    deleteOccupation,
    getOccupationById,
    getOccupations,
    updateOccupation,
} from "./occupation.controller";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = express.Router();
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
router.post("/", authenticate, createOccupation);
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
router.get("/", getOccupations);
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
router.get("/:id", getOccupationById);
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
router.put("/:id", authenticate, updateOccupation);
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
router.patch("/:id", authenticate, deleteOccupation);

export const occupationRouter = router;