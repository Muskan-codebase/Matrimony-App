import { Router } from "express";
import {
    createCaste,
    getCastes,
    getCastesByReligion,
    getCasteById,
    updateCaste,
    deleteCaste,
} from "./caste.controllers";
import { authenticate } from "../../../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Religion - Caste (Admin)
 *   description: Caste Management APIs
 */

/**
 * @swagger
 * /v1/api/admin/caste:
 *   post:
 *     summary: Create a new caste
 *     tags: [Religion - Caste (Admin)]
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
 *               - caste
 *             properties:
 *               religionId:
 *                 type: string
 *                 example: 6870d7d1d87f5f3c5f9c1234
 *               caste:
 *                 type: string
 *                 example: Brahmin
 *     responses:
 *       201:
 *         description: Caste created successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Religion not found.
 *       409:
 *         description: Caste already exists.
 */
router.post("/", authenticate, createCaste);
/**
 * @swagger
 * /v1/api/admin/caste:
 *   get:
 *     summary: Get all castes
 *     tags: [Religion - Caste (Admin)]
 *     responses:
 *       200:
 *         description: List of all castes.
 */
router.get("/", getCastes);
/**
 * @swagger
 * /v1/api/admin/caste/religion/{religionId}:
 *   get:
 *     summary: Get all castes by religion
 *     tags: [Religion - Caste (Admin)]
 *     parameters:
 *       - in: path
 *         name: religionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Religion ID
 *     responses:
 *       200:
 *         description: List of castes for the specified religion.
 *       404:
 *         description: Religion not found.
 */
router.get("/religion/:religionId", getCastesByReligion);
/**
 * @swagger
 * /v1/api/admin/caste/{id}:
 *   get:
 *     summary: Get caste by ID
 *     tags: [Religion - Caste (Admin)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Caste ID
 *     responses:
 *       200:
 *         description: Caste fetched successfully.
 *       404:
 *         description: Caste not found.
 */
router.get("/:id", getCasteById);
/**
 * @swagger
 * /v1/api/admin/caste/{id}:
 *   put:
 *     summary: Update caste
 *     tags: [Religion - Caste (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Caste ID
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
 *               caste:
 *                 type: string
 *                 example: Kshatriya
 *     responses:
 *       200:
 *         description: Caste updated successfully.
 *       404:
 *         description: Caste not found.
 *       409:
 *         description: Caste already exists.
 */
router.put("/:id", authenticate, updateCaste);
/**
 * @swagger
 * /v1/api/admin/caste/{id}:
 *   patch:
 *     summary: Delete caste (Soft Delete)
 *     tags: [Religion - Caste (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Caste ID
 *     responses:
 *       200:
 *         description: Caste deleted successfully.
 *       404:
 *         description: Caste not found.
 */
router.patch("/:id", authenticate, deleteCaste);

export const casteRouter = router;