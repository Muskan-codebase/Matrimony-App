import { Router } from "express";
import {
    createLocation,
    deleteLocation,
    getLocationById,
    getLocations,
    updateLocation,
} from "./location.controller";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Location (Admin)
 *   description: Location management APIs
 */
/**
 * @swagger
 * /v1/api/admin/location:
 *   post:
 *     summary: Create Location
 *     description: Creates a new country, state, and city combination for use in matrimony profile location dropdowns.
 *     tags: [Location (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country
 *               - state
 *               - city
 *             properties:
 *               country:
 *                 type: string
 *                 example: India
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               city:
 *                 type: string
 *                 example: Pune
 *     responses:
 *       201:
 *         description: Location created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       409:
 *         description: Location already exists.
 */
router.post("/", authenticate, createLocation);
/**
 * @swagger
 * /v1/api/admin/location:
 *   get:
 *     summary: Get All Locations
 *     description: Retrieves all available locations for the matrimony profile location dropdown.
 *     tags: [Location (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Locations retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */
router.get("/", authenticate, getLocations);
/**
 * @swagger
 * /v1/api/admin/location/{id}:
 *   get:
 *     summary: Get Location By ID
 *     description: Retrieves a specific location by its unique ID.
 *     tags: [Location (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Location not found.
 */
router.get("/:id", authenticate, getLocationById);
/**
 * @swagger
 * /v1/api/admin/location/{id}:
 *   put:
 *     summary: Update Location
 *     description: Updates an existing location used in the matrimony profile location dropdown.
 *     tags: [Location (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 example: India
 *               state:
 *                 type: string
 *                 example: Karnataka
 *               city:
 *                 type: string
 *                 example: Bengaluru
 *     responses:
 *       200:
 *         description: Location updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Location not found.
 */
router.put("/:id", authenticate, updateLocation);
/**
 * @swagger
 * /v1/api/admin/location/{id}:
 *   patch:
 *     summary: Delete Location
 *     description: Soft deletes a location by marking it as deleted.
 *     tags: [Location (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Location not found.
 */
router.patch("/:id", authenticate, deleteLocation);

export const locationRouter = router;