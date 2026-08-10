import { Router } from "express";
import { authenticate } from "../../../middlewares/authMiddleware";
import {
    reportProfile, getProfileReports, getProfileReportById,
    blockReportedProfile, dismissProfileReport
} from "./reportProfile.controllers";
const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Report Profile (User)
 *     description: User profile reporting APIs
 *   - name: Report Profile (Admin)
 *     description: Admin profile report management APIs
 */

/**
 * @swagger
 * /v1/api/profile-report/{profileId}:
 *   post:
 *     summary: Report Profile
 *     tags: [Report Profile (User)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID to report
 *         example: 6a75914e8b3b14a68bc91234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Photo is fake or publishes incorrect information
 *     responses:
 *       201:
 *         description: Profile reported successfully
 *       400:
 *         description: Invalid profile ID, self-report, or profile already reported
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.post("/:profileId", authenticate, reportProfile);
/**
 * @swagger
 * /v1/api/profile-report:
 *   get:
 *     summary: Get Profile Reports
 *     tags: [Report Profile (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           example: pending
 *         description: Filter reports by status
 *     responses:
 *       200:
 *         description: Profile reports fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticate, getProfileReports);
/**
 * @swagger
 * /v1/api/profile-report/{reportId}:
 *   get:
 *     summary: Get Profile Report By ID
 *     tags: [Report Profile (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile report ID
 *         example: 6a796ee9bce55d506f02690c
 *     responses:
 *       200:
 *         description: Profile report fetched successfully
 *       400:
 *         description: Invalid report ID
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal server error
 */
router.get("/:reportId", authenticate, getProfileReportById);
/**
 * @swagger
 * /v1/api/profile-report/block/{reportId}:
 *   patch:
 *     summary: Block Reported Profile
 *     tags: [Report Profile (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile report ID
 *         example: 6a796ee9bce55d506f02690c
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminNote:
 *                 type: string
 *                 example: Profile permanently blocked after admin review.
 *     responses:
 *       200:
 *         description: Profile permanently blocked successfully
 *       400:
 *         description: Invalid report ID or report already resolved
 *       404:
 *         description: Report or reported profile not found
 *       500:
 *         description: Internal server error
 */
router.patch("/block/:reportId", authenticate, blockReportedProfile);
/**
 * @swagger
 * /v1/api/profile-report/dismiss/{reportId}:
 *   patch:
 *     summary: Dismiss Profile Report
 *     tags: [Report Profile (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile report ID
 *         example: 6a796ee9bce55d506f02690c
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminNote:
 *                 type: string
 *                 example: Report reviewed and no violation found.
 *     responses:
 *       200:
 *         description: Profile report dismissed successfully
 *       400:
 *         description: Invalid report ID or report already resolved
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal server error
 */
router.patch("/dismiss/:reportId", authenticate, dismissProfileReport);

export const reportProfileRouter = router