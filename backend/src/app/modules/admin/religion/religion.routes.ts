import { Router } from "express";

import {

    createReligion,
    getReligions,
    getReligionById,
    updateReligion,
    deleteReligion,

} from "./religion.controllers";

import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();
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
router.post("/", authenticate, createReligion);
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
router.get("/", getReligions);
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
router.get("/:id", getReligionById);
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
router.put("/:id", authenticate, updateReligion);
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
router.patch("/:id", authenticate, deleteReligion);

export const religionRouter = router;