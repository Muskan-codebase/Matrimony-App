"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthRouter = void 0;
const express_1 = require("express");
const adminAuth_controller_1 = require("./adminAuth.controller");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /v1/api/admin/auth/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticates an administrator using email and password and returns an access token and refresh token.
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@matrimony.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Admin logged in successfully.
 *       401:
 *         description: Invalid email or password.
 *       404:
 *         description: Admin not found.
 */
router.post("/login", adminAuth_controller_1.loginAdmin);
/**
 * @swagger
 * /v1/api/admin/auth/refresh-token:
 *   post:
 *     summary: Refresh Admin Access Token
 *     description: Generates a new access token using a valid admin refresh token.
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Access token generated successfully.
 *       401:
 *         description: Invalid or expired refresh token.
 */
router.post("/refresh-token", adminAuth_controller_1.refreshAdminToken);
/**
 * @swagger
 * /v1/api/admin/auth/logout:
 *   post:
 *     summary: Admin Logout
 *     description: Logs out the authenticated administrator by invalidating the stored refresh token.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Admin logged out successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Admin not found.
 */
router.post("/logout", authMiddleware_1.authenticate, adminAuth_controller_1.logoutAdmin);
/**
 * @swagger
 * /v1/api/admin/auth/me:
 *   get:
 *     summary: Get Current Admin
 *     description: Retrieves the authenticated administrator's profile information.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admin details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Admin not found.
 */
router.get("/me", authMiddleware_1.authenticate, adminAuth_controller_1.getCurrentAdmin);
exports.adminAuthRouter = router;
