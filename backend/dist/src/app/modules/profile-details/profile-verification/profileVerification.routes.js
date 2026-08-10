"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileVerificationRouter = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const profileVerification_controllers_1 = require("./profileVerification.controllers");
const cloudinary_1 = require("../../../config/cloudinary");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Profile Verification (User)
 *   description: APIs for user profile verification and admin verification review
 */
/**
 * @swagger
 * /v1/api/profile-verification/submit:
 *   post:
 *     summary: Submit profile verification
 *     description: Allows a logged-in user to submit their selfie and Aadhaar document for profile verification.
 *     tags: [Profile Verification (User)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - selfie
 *               - adhaarFront
 *             properties:
 *               selfie:
 *                 type: string
 *                 format: binary
 *                 description: User selfie image
 *               adhaarFront:
 *                 type: string
 *                 format: binary
 *                 description: Adhaar document image or PDF
 *     responses:
 *       200:
 *         description: Profile verification submitted successfully
 *       400:
 *         description: Validation error or verification request already pending/approved
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.post("/submit", authMiddleware_1.authenticate, cloudinary_1.upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "adhaarFront", maxCount: 1 },
]), profileVerification_controllers_1.submitVerification);
/**
 * @swagger
 * /v1/api/profile-verification/my:
 *   get:
 *     summary: Get my profile verification
 *     description: Returns the logged-in user's profile verification status and verification details.
 *     tags: [Profile Verification (User)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile verification fetched successfully
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
 *                   example: Profile verification fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     verification:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 6a759300b4198b1ec5792a72
 *                         profileId:
 *                           type: string
 *                           example: 6a6d7efcf29afe029cc242ab
 *                         selfieUrl:
 *                           type: string
 *                           example: https://res.cloudinary.com/example/image/upload/selfie.jpg
 *                         aadhaarFrontUrl:
 *                           type: string
 *                           example: https://res.cloudinary.com/example/image/upload/aadhaar.jpg
 *                         status:
 *                           type: string
 *                           enum:
 *                             - PENDING
 *                             - APPROVED
 *                             - REJECTED
 *                           example: PENDING
 *                         rejectionReason:
 *                           type: string
 *                           nullable: true
 *                           example: Aadhaar document is not clear
 *                         submittedAt:
 *                           type: string
 *                           format: date-time
 *                         reviewedBy:
 *                           type: string
 *                           nullable: true
 *                         reviewedAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.get("/my", authMiddleware_1.authenticate, profileVerification_controllers_1.getMyVerification);
/**
 * @swagger
 * /v1/api/profile-verification/admin:
 *   get:
 *     summary: Get all profile verification requests
 *     description: Returns all profile verification requests for admin review.
 *     tags: [Profile Verification (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile verification requests fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/admin", authMiddleware_1.authenticate, profileVerification_controllers_1.getAllVerifications);
/**
 * @swagger
 * /v1/api/profile-verification/admin/{id}:
 *   get:
 *     summary: Get profile verification by ID
 *     description: Returns a specific profile verification request for admin review.
 *     tags: [Profile Verification (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Profile verification ID
 *         schema:
 *           type: string
 *           example: 6a759300b4198b1ec5792a72
 *     responses:
 *       200:
 *         description: Profile verification fetched successfully
 *       400:
 *         description: Invalid verification ID
 *       404:
 *         description: Profile verification not found
 *       500:
 *         description: Internal server error
 */
router.get("/admin/:id", authMiddleware_1.authenticate, profileVerification_controllers_1.getVerificationById);
/**
 * @swagger
 * /v1/api/profile-verification/admin/{id}:
 *   patch:
 *     summary: Review profile verification
 *     description: Allows an admin to approve or reject a profile verification request.
 *     tags: [Profile Verification (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Profile verification ID
 *         schema:
 *           type: string
 *           example: 6a759300b4198b1ec5792a72
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - approved
 *                   - rejected
 *                 example: approved
 *               rejectionReason:
 *                 type: string
 *                 nullable: true
 *                 example: Aadhaar document is not clear
 *     responses:
 *       200:
 *         description: Profile verification reviewed successfully
 *       400:
 *         description: Validation failed or profile is already verified
 *       404:
 *         description: Profile verification not found
 *       500:
 *         description: Internal server error
 */
router.patch("/admin/:id", authMiddleware_1.authenticate, profileVerification_controllers_1.reviewVerification);
/**
 * @swagger
 * /v1/api/profile-verification/admin/{id}:
 *   delete:
 *     summary: Delete profile verification
 *     description: Deletes a profile verification request.
 *     tags: [Profile Verification (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Profile verification ID
 *         schema:
 *           type: string
 *           example: 6a759300b4198b1ec5792a72
 *     responses:
 *       200:
 *         description: Profile verification deleted successfully
 *       400:
 *         description: Invalid verification ID
 *       404:
 *         description: Profile verification not found
 *       500:
 *         description: Internal server error
 */
router.delete("/admin/:id", authMiddleware_1.authenticate, profileVerification_controllers_1.deleteVerification);
exports.profileVerificationRouter = router;
