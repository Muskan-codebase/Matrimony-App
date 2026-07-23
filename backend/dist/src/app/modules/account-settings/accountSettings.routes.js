"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountSettingsRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const accountSettings_controller_1 = require("./accountSettings.controller");
const router = (0, express_1.Router)();
// router.post(
//     "/",
//     authenticate,
//     createAccountSettings
// );
/**
 * @swagger
 * tags:
 *   - name: Profile - Account Settings
 *     description: APIs for managing user's account settings.
 */
/**
 * @swagger
 * /v1/api/account-settings:
 *   get:
 *     summary: Get Account Settings
 *     description: Retrieves the logged-in user's account settings. If no account settings exist, a default account settings document is created automatically.
 *     tags: [Profile - Account Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account settings retrieved successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 */
router.get("/", authMiddleware_1.authenticate, accountSettings_controller_1.getAccountSettings);
/**
 * @swagger
 * /v1/api/account-settings/privacy:
 *   patch:
 *     summary: Update Privacy Settings
 *     description: Updates the logged-in user's privacy settings such as mobile number visibility, profile visibility, album privacy, and last seen status.
 *     tags: [Profile - Account Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNoVisibility:
 *                 type: string
 *                 enum:
 *                   - "Visible to all"
 *                   - "Only to interest sent/accepted"
 *                   - "Don't show to anyone"
 *               profileVisibility:
 *                 type: string
 *                 enum:
 *                   - "Visible to all (default)"
 *                   - "Incognito mode"
 *                   - "Only to matches that fit my criteria"
 *               albumPrivacy:
 *                 type: string
 *                 enum:
 *                   - "Visible to all (default)"
 *                   - "Only to paid matches"
 *                   - "Only to interest sent/accepted"
 *               lastSeenStatus:
 *                 type: string
 *                 enum:
 *                   - "Visible to all (default)"
 *                   - "Hide from all"
 *                   - "Visible to accepted matches"
 *     responses:
 *       200:
 *         description: Privacy settings updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 */
router.patch("/privacy", authMiddleware_1.authenticate, accountSettings_controller_1.updatePrivacySettings);
/**
 * @swagger
 * /v1/api/account-settings/hide-profile:
 *   patch:
 *     summary: Hide Profile
 *     description: Temporarily hides the logged-in user's profile for the selected duration.
 *     tags: [Profile - Account Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: string
 *                 enum:
 *                   - "7 days"
 *                   - "15 days"
 *                   - "30 days"
 *     responses:
 *       200:
 *         description: Profile hidden successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 */
router.patch("/hide-profile", authMiddleware_1.authenticate, accountSettings_controller_1.hideProfile);
/**
 * @swagger
 * /v1/api/account-settings/unhide-profile:
 *   patch:
 *     summary: Unhide Profile
 *     description: Makes the logged-in user's profile visible again by removing the hidden status.
 *     tags: [Profile - Account Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile is now visible.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 */
router.patch("/unhide-profile", authMiddleware_1.authenticate, accountSettings_controller_1.unhideProfile);
/**
 * @swagger
 * /v1/api/account-settings/notifications/app:
 *   put:
 *     summary: Update App Notification Settings
 *     tags: [Profile - Account Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dailyRecommendations:
 *                 type: boolean
 *                 example: true
 *               justJoined:
 *                 type: boolean
 *                 example: true
 *               pendingInterests:
 *                 type: boolean
 *                 example: false
 *               expiringInterests:
 *                 type: boolean
 *                 example: true
 *               profileVisitors:
 *                 type: boolean
 *                 example: true
 *               similarProfiles:
 *                 type: boolean
 *                 example: false
 *               filteredInterests:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: App notification settings updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Account settings not found.
 */
router.put("/notifications/app", authMiddleware_1.authenticate, accountSettings_controller_1.updateAppNotifications);
/**
 * @swagger
 * /v1/api/account-settings/notifications/sms:
 *   put:
 *     summary: Update SMS Notification Settings
 *     tags: [Profile - Account Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               membershipSMS:
 *                 type: boolean
 *                 example: true
 *               transactionalSMS:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: SMS notification settings updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Account settings not found.
 */
router.put("/notifications/sms", authMiddleware_1.authenticate, accountSettings_controller_1.updateSmsNotifications);
/**
 * @swagger
 * /v1/api/account-settings/notifications/email:
 *   put:
 *     summary: Update Email Notification Settings
 *     tags: [Profile - Account Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matchAlertMails:
 *                 type: string
 *                 enum:
 *                   - "Daily"
 *                   - "3 times/week"
 *                   - "Unsubscribe"
 *                 example: "Daily"
 *               visitorAlertMails:
 *                 type: string
 *                 enum:
 *                   - "Daily"
 *                   - "Days I do not login"
 *                   - "Unsubscribe"
 *                 example: "Daily"
 *               membershipMails:
 *                 type: boolean
 *                 example: true
 *               newMatchesMails:
 *                 type: boolean
 *                 example: true
 *               contactAlertMails:
 *                 type: boolean
 *                 example: false
 *               photoRequestMails:
 *                 type: boolean
 *                 example: true
 *               kundliAlertMails:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Email notification settings updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Account settings not found.
 */
router.put("/notifications/email", authMiddleware_1.authenticate, accountSettings_controller_1.updateEmailNotifications);
/**
 * @swagger
 * /v1/api/account-settings/delete-profile:
 *   delete:
 *     summary: Delete Profile
 *     description: Soft deletes the logged-in user's account, profile, and account settings.
 *     tags: [Profile - Account Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.delete("/delete-profile", authMiddleware_1.authenticate, accountSettings_controller_1.deleteProfile);
exports.accountSettingsRouter = router;
