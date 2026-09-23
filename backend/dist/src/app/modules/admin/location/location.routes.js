"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationRouter = void 0;
const express_1 = require("express");
const location_controller_1 = require("./location.controller");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
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
router.post("/", authMiddleware_1.authenticate, location_controller_1.createLocation);
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
router.get("/", authMiddleware_1.authenticate, location_controller_1.getLocations);
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
router.get("/:id", authMiddleware_1.authenticate, location_controller_1.getLocationById);
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
router.put("/:id", authMiddleware_1.authenticate, location_controller_1.updateLocation);
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
router.patch("/:id", authMiddleware_1.authenticate, location_controller_1.deleteLocation);
exports.locationRouter = router;
