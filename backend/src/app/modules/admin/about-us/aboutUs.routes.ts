import { Router } from "express";
import { upload } from "../../../config/cloudinary";
import { createOrUpdateAboutUs, getAboutUs } from "./aboutUs.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: About Us
 *   description: About Us Management APIs
 */

/**
 * @swagger
 * /v1/api/admin/about-us:
 *   put:
 *     summary: Create or Update About Us
 *     description: Creates the About Us document if it does not exist, otherwise updates the existing document.
 *     tags: [About Us]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *
 *               ceoHeading:
 *                 type: string
 *               ceoImage:
 *                 type: string
 *                 format: binary
 *               ceoDescription:
 *                 type: string
 *               ceoDesignation:
 *                 type: string
 *
 *               missionVisionHeading:
 *                 type: string
 *               missionTitle:
 *                 type: string
 *               missionDescription:
 *                 type: string
 *               visionTitle:
 *                 type: string
 *               visionDescription:
 *                 type: string
 *
 *               aboutHeading:
 *                 type: string
 *               aboutImage:
 *                 type: string
 *                 format: binary
 *               aboutDescription:
 *                 type: string
 *               verifiedProfiles:
 *                 type: number
 *               successfulMatches:
 *                 type: number
 *               citiesCovered:
 *                 type: number
 *               yearsOfTrust:
 *                 type: number
 *
 *               awardWinnerHeading:
 *                 type: string
 *               awardImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               awardTitles:
 *                 type: array
 *                 items:
 *                   type: string
 *               awardSubtitles:
 *                 type: array
 *                 items:
 *                   type: string
 *
 *               howToUseHeading:
 *                 type: string
 *               stepTitles:
 *                 type: array
 *                 items:
 *                   type: string
 *               stepDescriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *
 *               moneyBackGuaranteeHeading:
 *                 type: string
 *               moneyBackGuaranteeDescription:
 *                 type: string
 *               moneyBackGuaranteeNote:
 *                 type: string
 *
 *               secureHeading:
 *                 type: string
 *               securityFeatureTitles:
 *                 type: array
 *                 items:
 *                   type: string
 *               securityFeatureDescriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *
 *     responses:
 *       200:
 *         description: About Us saved successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.put("/", authenticate, upload.fields([
    { name: "ceoImage", maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
    { name: "awardImages", maxCount: 20 },
]),
    createOrUpdateAboutUs
);
/**
 * @swagger
 * /v1/api/admin/about-us:
 *   get:
 *     summary: Get About Us
 *     description: Returns the About Us CMS content.
 *     tags: [About Us]
 *     responses:
 *       200:
 *         description: About Us fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       404:
 *         description: About Us not found.
 */
router.get("/", getAboutUs);

export const aboutUsRouter = router;