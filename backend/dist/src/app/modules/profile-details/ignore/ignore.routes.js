"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const ignore_controllers_1 = require("./ignore.controllers");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   - name: Profile - Ignore
 *     description: APIs for managing ignored profiles.
 */
/**
 * @swagger
 * /v1/api/ignore:
 *   post:
 *     summary: Ignore a profile
 *     description: Adds another user's profile to the logged-in user's ignored list.
 *     tags: [Profile - Ignore]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ignoredUserId
 *             properties:
 *               ignoredUserId:
 *                 type: string
 *                 example: "68809d91e5e14d0d4b3c1001"
 *     responses:
 *       201:
 *         description: Profile ignored successfully.
 *       400:
 *         description: Invalid request or cannot ignore your own profile.
 *       404:
 *         description: Profile not found.
 *       409:
 *         description: Profile already ignored.
 *       500:
 *         description: Internal server error.
 */
router.post("/", authMiddleware_1.authenticate, ignore_controllers_1.addToIgnore);
/**
 * @swagger
 * /v1/api/ignore:
 *   get:
 *     summary: Get my ignored profiles
 *     description: Returns all profiles ignored by the logged-in user.
 *     tags: [Profile - Ignore]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ignored profiles fetched successfully.
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/", authMiddleware_1.authenticate, ignore_controllers_1.getMyIgnoredProfiles);
/**
 * @swagger
 * /v1/api/ignore/{id}:
 *   get:
 *     summary: Get ignored profile by ID
 *     description: Returns a specific ignored profile using the ignore record ID.
 *     tags: [Profile - Ignore]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ignore record ID
 *     responses:
 *       200:
 *         description: Ignored profile fetched successfully.
 *       400:
 *         description: Invalid ignore ID.
 *       404:
 *         description: Ignored profile not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", authMiddleware_1.authenticate, ignore_controllers_1.getIgnoreById);
/**
 * @swagger
 * /v1/api/ignore/{id}:
 *   delete:
 *     summary: Remove profile from ignored list
 *     description: Removes a profile from the logged-in user's ignored list.
 *     tags: [Profile - Ignore]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ignore record ID
 *     responses:
 *       200:
 *         description: Profile removed from ignored list successfully.
 *       400:
 *         description: Invalid ignore ID.
 *       404:
 *         description: Ignored profile not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", authMiddleware_1.authenticate, ignore_controllers_1.removeFromIgnore);
exports.ignoreRouter = router;
