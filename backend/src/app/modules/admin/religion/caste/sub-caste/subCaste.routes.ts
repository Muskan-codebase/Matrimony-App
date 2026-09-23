import { Router } from "express";
import {
    createSubCaste,
    getSubCastes,
    getSubCastesByCaste,
    getSubCasteById,
    updateSubCaste,
    deleteSubCaste,
} from "./subCaste.controllers";
import { authenticate } from "../../../../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Religion - Caste - Sub-Caste (Admin)
 *   description: Sub-Caste Management APIs
 */

/**
 * @swagger
 * /v1/api/admin/sub-caste:
 *   post:
 *     summary: Create a new sub-caste
 *     tags: [Religion - Caste - Sub-Caste (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - religionId
 *               - casteId
 *               - subCaste
 *             properties:
 *               religionId:
 *                 type: string
 *                 example: 6870d7d1d87f5f3c5f9c1234
 *               casteId:
 *                 type: string
 *                 example: 6870d8f7d87f5f3c5f9c5678
 *               subCaste:
 *                 type: string
 *                 example: Chitpavan
 *     responses:
 *       201:
 *         description: Sub-caste created successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Religion or Caste not found.
 *       409:
 *         description: Sub-caste already exists.
 */
router.post("/", authenticate, createSubCaste);
/**
 * @swagger
 * /v1/api/admin/sub-caste:
 *   get:
 *     summary: Get all sub-castes
 *     tags: [Religion - Caste - Sub-Caste (Admin)]
 *     responses:
 *       200:
 *         description: List of all sub-castes.
 */
router.get("/", getSubCastes);
/**
 * @swagger
 * /v1/api/admin/sub-caste/caste/{casteId}:
 *   get:
 *     summary: Get all sub-castes by caste
 *     tags: [Religion - Caste - Sub-Caste (Admin)]
 *     parameters:
 *       - in: path
 *         name: casteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Caste ID
 *     responses:
 *       200:
 *         description: List of sub-castes for the specified caste.
 */
router.get("/caste/:casteId", getSubCastesByCaste);
/**
 * @swagger
 * /v1/api/admin/sub-caste/{id}:
 *   get:
 *     summary: Get sub-caste by ID
 *     tags: [Religion - Caste - Sub-Caste (Admin)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sub-caste ID
 *     responses:
 *       200:
 *         description: Sub-caste fetched successfully.
 *       404:
 *         description: Sub-caste not found.
 */
router.get("/:id", getSubCasteById);
/**
 * @swagger
 * /v1/api/admin/sub-caste/{id}:
 *   put:
 *     summary: Update sub-caste
 *     tags: [Religion - Caste - Sub-Caste (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sub-caste ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               religionId:
 *                 type: string
 *                 example: 6870d7d1d87f5f3c5f9c1234
 *               casteId:
 *                 type: string
 *                 example: 6870d8f7d87f5f3c5f9c5678
 *               subCaste:
 *                 type: string
 *                 example: Deshastha
 *     responses:
 *       200:
 *         description: Sub-caste updated successfully.
 *       404:
 *         description: Sub-caste not found.
 *       409:
 *         description: Sub-caste already exists.
 */
router.put("/:id", authenticate, updateSubCaste);
/**
 * @swagger
 * /v1/api/admin/sub-caste/{id}:
 *   patch:
 *     summary: Delete sub-caste (Soft Delete)
 *     tags: [Religion - Caste - Sub-Caste (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sub-caste ID
 *     responses:
 *       200:
 *         description: Sub-caste deleted successfully.
 *       404:
 *         description: Sub-caste not found.
 */
router.patch("/:id", authenticate, deleteSubCaste);

export const subCasteRouter = router;