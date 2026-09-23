import express from "express";
import { authenticate } from "../../../middlewares/authMiddleware";
import {
    blockProfile,
    getMyBlockedProfiles,
    getBlockedProfileById,
    unblockProfile,
} from "./block.controllers";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Profile - Block
 *     description: APIs for managing blocked profiles.
 */

/**
 * @swagger
 * /v1/api/block:
 *   post:
 *     summary: Block a profile
 *     description: Blocks another user's profile for the logged-in user.
 *     tags: [Profile - Block]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blockedUserId
 *             properties:
 *               blockedUserId:
 *                 type: string
 *                 example: "68809d91e5e14d0d4b3c1001"
 *     responses:
 *       201:
 *         description: Profile blocked successfully.
 *       400:
 *         description: Invalid request or cannot block your own profile.
 *       404:
 *         description: Profile not found.
 *       409:
 *         description: Profile already blocked.
 *       500:
 *         description: Internal server error.
 */
router.post("/", authenticate, blockProfile);
/**
 * @swagger
 * /v1/api/block:
 *   get:
 *     summary: Get my blocked profiles
 *     description: Returns all profiles blocked by the logged-in user.
 *     tags: [Profile - Block]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blocked profiles fetched successfully.
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/", authenticate, getMyBlockedProfiles);
/**
 * @swagger
 * /v1/api/block/{id}:
 *   get:
 *     summary: Get blocked profile by ID
 *     description: Returns a specific blocked profile using the block record ID.
 *     tags: [Profile - Block]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Block record ID.
 *     responses:
 *       200:
 *         description: Blocked profile fetched successfully.
 *       400:
 *         description: Invalid block ID.
 *       404:
 *         description: Blocked profile not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", authenticate, getBlockedProfileById);
/**
 * @swagger
 * /v1/api/block/{id}:
 *   delete:
 *     summary: Unblock a profile
 *     description: Removes a profile from the logged-in user's blocked list.
 *     tags: [Profile - Block]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Block record ID.
 *     responses:
 *       200:
 *         description: Profile unblocked successfully.
 *       400:
 *         description: Invalid block ID.
 *       404:
 *         description: Blocked profile not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", authenticate, unblockProfile);

export const blockRouter = router;