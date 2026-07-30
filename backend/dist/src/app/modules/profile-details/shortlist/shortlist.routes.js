"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortlistedRouter = void 0;
const express_1 = __importDefault(require("express"));
const shortlist_controller_1 = require("./shortlist.controller");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   - name: Profile - Short Listed
 *     description: APIs for managing shortlisted profiles.
 */
/**
 * @swagger
 * /v1/api/shortlist:
 *   post:
 *     summary: Add profile to shortlist
 *     description: Adds another user's profile to the logged-in user's shortlist.
 *     tags: [Profile - Short Listed]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shortlistedUserId
 *             properties:
 *               shortlistedUserId:
 *                 type: string
 *                 example: "68809d91e5e14d0d4b3c1001"
 *     responses:
 *       201:
 *         description: Profile shortlisted successfully.
 *       400:
 *         description: Invalid request or cannot shortlist yourself.
 *       404:
 *         description: Profile not found.
 *       409:
 *         description: Profile already shortlisted.
 *       500:
 *         description: Internal server error.
 */
router.post("/", authMiddleware_1.authenticate, shortlist_controller_1.addToShortlist);
/**
 * @swagger
 * /v1/api/shortlist:
 *   get:
 *     summary: Get my shortlisted profiles
 *     description: Returns all profiles shortlisted by the logged-in user.
 *     tags: [Profile - Short Listed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shortlisted profiles fetched successfully.
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/", authMiddleware_1.authenticate, shortlist_controller_1.getMyShortlistedProfiles);
/**
 * @swagger
 * /v1/api/shortlists/who-shortlisted-me:
 *   get:
 *     summary: Get users who shortlisted my profile
 *     tags: [Profile - Short Listed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users who shortlisted the logged-in user's profile fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "689f2b7c3d4a8d0012345678"
 *                       userId:
 *                         $ref: '#/components/schemas/Profile'
 *                       shortlistedUserId:
 *                         type: string
 *                         example: "689f2b7c3d4a8d0098765432"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-30T08:20:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-30T08:20:00.000Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Logged-in user's profile not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/who-shortlisted-me", authMiddleware_1.authenticate, shortlist_controller_1.getUsersWhoShortlistedMe);
/**
 * @swagger
 * /v1/api/shortlist/{id}:
 *   get:
 *     summary: Get shortlisted profile by ID
 *     description: Returns a specific shortlisted profile by shortlist ID.
 *     tags: [Profile - Short Listed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shortlist ID
 *     responses:
 *       200:
 *         description: Shortlisted profile fetched successfully.
 *       400:
 *         description: Invalid shortlist ID.
 *       404:
 *         description: Shortlist not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", authMiddleware_1.authenticate, shortlist_controller_1.getShortlistById);
/**
 * @swagger
 * /v1/api/shortlist/{id}:
 *   delete:
 *     summary: Remove profile from shortlist
 *     description: Removes a profile from the logged-in user's shortlist.
 *     tags: [Profile - Short Listed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shortlist ID
 *     responses:
 *       200:
 *         description: Profile removed from shortlist successfully.
 *       400:
 *         description: Invalid shortlist ID.
 *       404:
 *         description: Shortlist not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", authMiddleware_1.authenticate, shortlist_controller_1.removeFromShortlist);
exports.shortlistedRouter = router;
