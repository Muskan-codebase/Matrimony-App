import { getMyNotifications } from "./inAppNotifications.controller";
import { Router } from "express";
import { authenticate } from "../../../middlewares/authMiddleware";
const router = Router();
/**
 * @swagger
 * /v1/api/app-notification/my-notifications:
 *   get:
 *     summary: Get in-app notifications
 *     description: Get in-app notifications for the logged-in user, including interest requests, shortlistings, and profile visits.
 *     tags:
 *       - In-App Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/my-notifications", authenticate, getMyNotifications);

export const inAppNotificationsRouter = router;