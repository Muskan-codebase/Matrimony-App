import { Router } from "express";
import {
    createQualification,
    deleteQualification,
    getQualificationById,
    getQualifications,
    updateQualification,
} from "./qualification.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Qualification (Admin)
 *   description: Height management APIs
 */
/**
 * @swagger
 * /v1/api/admin/qualification:
 *   post:
 *     summary: Create Qualification
 *     description: Creates a new qualification option including education, education type, occupation, and annual income for use in matrimony profile dropdowns.
 *     tags: [Qualification (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - education
 *               - educationType
 *               - occupation
 *               - annualIncome
 *             properties:
 *               education:
 *                 type: string
 *                 example: Bachelor of Engineering
 *               educationType:
 *                 type: string
 *                 example: Engineering
 *               occupation:
 *                 type: string
 *                 example: Software Engineer
 *              
 *     responses:
 *       201:
 *         description: Qualification created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       409:
 *         description: Qualification already exists.
 */
router.post("/", authenticate, createQualification);
/**
 * @swagger
 * /v1/api/admin/qualification:
 *   get:
 *     summary: Get All Qualifications
 *     description: Retrieves all qualification options for the matrimony profile education, education type, occupation, and annual income dropdowns.
 *     tags: [Qualification (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Qualifications retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/", getQualifications);
/**
 * @swagger
 * /v1/api/admin/qualification/{id}:
 *   get:
 *     summary: Get Qualification By ID
 *     description: Retrieves a specific qualification option by its unique ID.
 *     tags: [Qualification (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Qualification ID
 *     responses:
 *       200:
 *         description: Qualification retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Qualification not found.
 */
router.get("/:id", getQualificationById);
/**
 * @swagger
 * /v1/api/admin/qualification/{id}:
 *   put:
 *     summary: Update Qualification
 *     description: Updates an existing qualification option used in matrimony profile dropdowns.
 *     tags: [Qualification (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Qualification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               education:
 *                 type: string
 *                 example: Master of Computer Applications
 *               educationType:
 *                 type: string
 *                 example: Computer Science
 *               occupation:
 *                 type: string
 *                 example: Backend Developer
 * 
 *     responses:
 *       200:
 *         description: Qualification updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Qualification not found.
 */
router.put("/:id", authenticate, updateQualification);
/**
 * @swagger
 * /v1/api/admin/qualification/{id}:
 *   patch:
 *     summary: Delete Qualification
 *     description: Soft deletes a qualification option by marking it as deleted.
 *     tags: [Qualification (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Qualification ID
 *     responses:
 *       200:
 *         description: Qualification deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Qualification not found.
 */
router.patch("/:id", authenticate, deleteQualification);

export const qualificationRouter = router;