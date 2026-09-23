"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inAppNotificationsRouter = void 0;
const inAppNotifications_controller_1 = require("./inAppNotifications.controller");
const express_1 = require("express");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
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
router.get("/my-notifications", authMiddleware_1.authenticate, inAppNotifications_controller_1.getMyNotifications);
exports.inAppNotificationsRouter = router;
