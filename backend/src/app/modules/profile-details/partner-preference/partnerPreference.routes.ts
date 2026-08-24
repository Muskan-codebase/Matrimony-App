import express from "express";
import {
    savePartnerPreference,
    getPartnerPreference,
    resetPartnerPreferenceSection
} from "./partnerPreference.controller";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = express.Router();
/**
 * @swagger
 * /v1/api/partner-preference:
 *   post:
 *     summary: Save Partner Preference (creates on first save, updates on subsequent saves)
 *     tags: [Profile - Partner Preference]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basicDetails:
 *                 type: object
 *                 properties:
 *                   age:
 *                     type: object
 *                     properties:
 *                       minAge:
 *                         type: number
 *                         example: 24
 *                       maxAge:
 *                         type: number
 *                         example: 30
 *                   height:
 *                     type: object
 *                     properties:
 *                       minHeight:
 *                         type: string
 *                         example: 6878d1ab4f2bdf0012345678
 *                       maxHeight:
 *                         type: string
 *                         example: 6878d1ab4f2bdf0012345679
 *                   partnerCountry:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["India", "Canada"]
 *                   partnerState:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Maharashtra", "Ontario"]
 *                   partnerCity:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Pune", "Toronto"]
 *                   maritalStatus:
 *                     type: object
 *                     properties:
 *                       preferences:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum:
 *                             - "Never Married"
 *                             - "Divorce"
 *                             - "Widow"
 *                             - "Awaiting Divorce"
 *                         example: ["Never Married"]
 *               educationDetails:
 *                 type: object
 *                 properties:
 *                   doesntMatter:
 *                     type: boolean
 *                     example: false
 *                   highestDegrees:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - "6878d1ab4f2bdf0012345680"
 *                   wellKnownColleges:
 *                     type: string
 *                     example: "IIT Bombay"
 *                   occupation:
 *                     type: object
 *                     properties:
 *                       doesntMatter:
 *                         type: boolean
 *                         example: false
 *                       preferences:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - "Engineer"
 *                           - "IT / Software"
 *                   annualIncome:
 *                     type: string
 *                     example: 6878d1ab4f2bdf0012345681
 *               familyDetails:
 *                 type: object
 *                 properties:
 *                   familyBasedOutOfCountry:
 *                     type: object
 *                     properties:
 *                       country:
 *                         type: string
 *                         example: "India"
 *               religionAndEthnicity:
 *                 type: object
 *                 properties:
 *                   religion:
 *                     type: object
 *                     properties:
 *                       preference:
 *                         type: string
 *                         example: 6878d1ab4f2bdf0012345682
 *                   caste:
 *                     type: object
 *                     properties:
 *                       preferences:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - "6878d1ab4f2bdf0012345683"
 *                   subCaste:
 *                     type: object
 *                     properties:
 *                       preferences:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - "6878d1ab4f2bdf0012345685"
 *                   motherTongue:
 *                     type: object
 *                     properties:
 *                       preference:
 *                         type: string
 *                         example: 6878d1ab4f2bdf0012345684
 *                   manglikStatus:
 *                     type: object
 *                     properties:
 *                       preferences:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum:
 *                             - "Manglik"
 *                             - "Non Manglik"
 *                             - "Angshik (Partial Manglik)"
 *                             - "Doesn't Matter"
 *                         example:
 *                           - "Non Manglik"
 *               lifestyleAndAppearance:
 *                 type: object
 *                 properties:
 *                   dietaryHabits:
 *                     type: object
 *                     properties:
 *                       preferences:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum:
 *                             - "Vegetarian"
 *                             - "Non Vegetarian"
 *                             - "Jain"
 *                             - "Eggetarian"
 *                             - "Doesn't Matter"
 *                         example:
 *                           - "Vegetarian"
 *                   smokingHabits:
 *                     type: object
 *                     properties:
 *                       preferences:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum:
 *                             - "Yes"
 *                             - "No"
 *                             - "Occasionally"
 *                             - "Doesn't Matter"
 *                         example:
 *                           - "No"
 *                   drinkingHabits:
 *                     type: object
 *                     properties:
 *                       preferences:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum:
 *                             - "Yes"
 *                             - "No"
 *                             - "Occasionally"
 *                             - "Doesn't Matter"
 *                         example:
 *                           - "Occasionally"
 *                   disability:
 *                     type: object
 *                     properties:
 *                       preferences:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum:
 *                             - "None"
 *                             - "Physically disabled from birth"
 *                             - "Physically disabled due to accident"
 *                             - "Mentally disabled from birth"
 *                             - "Mentally disabled due to accident"
 *                             - "Doesn't Matter"
 *                         example:
 *                           - "None"
 *               aboutMyPartner:
 *                 type: object
 *                 properties:
 *                   description:
 *                     type: string
 *                     example: Looking for a caring, understanding and family-oriented life partner.
 *               createdBy:
 *                 type: string
 *                 example: "6878d1ab4f2bdf0012349999"
 *     responses:
 *       200:
 *         description: Partner preferences saved successfully (created on first save, updated thereafter).
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/",
    authenticate,
    savePartnerPreference
);
/**
 * @swagger
 * /v1/api/partner-preference:
 *   get:
 *     summary: Get Logged-in User's Partner Preference
 *     tags: [Profile - Partner Preference]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partner preferences fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Partner preferences fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6878d1ab4f2bdf0012345678
 *                     profileId:
 *                       type: object
 *                     basicDetails:
 *                       type: object
 *                     educationDetails:
 *                       type: object
 *                     familyDetails:
 *                       type: object
 *                     religionAndEthnicity:
 *                       type: object
 *                     lifestyleAndAppearance:
 *                       type: object
 *                     aboutMyPartner:
 *                       type: object
 *                     createdBy:
 *                       type: string
 *                       example: 6878d1ab4f2bdf0012345699
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Profile or partner preferences not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/", authenticate, getPartnerPreference);
/**
 * @swagger
 * /v1/api/partner-preference/reset/{section}:
 *   patch:
 *     summary: Reset a partner preference section
 *     description: |
 *       Resets a specific partner preference section to its default/empty values.
 *       The basicDetails section cannot be reset using this API.
 *
 *       Supported sections:
 *       - educationDetails
 *       - familyDetails
 *       - religionAndEthnicity
 *       - lifestyleAndAppearance
 *       - aboutMyPartner
 *
 *     tags:
 *       - Profile - Partner Preference
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: section
 *         required: true
 *         description: The partner preference section to reset.
 *         schema:
 *           type: string
 *           enum:
 *             - educationDetails
 *             - familyDetails
 *             - religionAndEthnicity
 *             - lifestyleAndAppearance
 *             - aboutMyPartner
 *
 *     responses:
 *       200:
 *         description: Partner preference section reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: educationDetails reset successfully.
 *                 data:
 *                   type: object
 *                   description: Updated partner preference with populated references.
 *
 *       400:
 *         description: Invalid or non-resettable section.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid or non-resettable section.
 *
 *       404:
 *         description: Profile or partner preferences not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Partner preferences not found.
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.patch("/reset/:section", authenticate, resetPartnerPreferenceSection);

export const partnerPreferenceRouter = router;