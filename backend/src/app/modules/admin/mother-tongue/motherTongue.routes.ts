import { Router } from "express";
import {
    createMotherTongue,
    deleteMotherTongue,
    getMotherTongueById,
    getMotherTongues,
    updateMotherTongue,
} from "./motherTongue.controller";
import { authenticate } from "../../../middlewares/authMiddleware";
import {
    createMotherTongueSchema,
    updateMotherTongueSchema,
} from "./motherTongue.validation";

const router = Router();

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
router.post("/", authenticate, createMotherTongue);
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
router.get("/", getMotherTongues);
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
router.get("/:id", getMotherTongueById);
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
router.patch("/:id", authenticate, updateMotherTongue);

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
router.delete("/:id", authenticate, deleteMotherTongue);

export const motherTongueRouter = router;