import express from "express";
import {
    createProfileVisit,
    getMyVisitedProfiles,
    getProfileVisitors,
    deleteProfileVisit,
} from "./profileVisits.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Profile Visits
 *     description: APIs for recording profile visits, viewing visited profiles, and retrieving profile visitors.
 */
/**
 * @swagger
 * /v1/api/profile-visits:
 *   post:
 *     summary: Record a profile visit
 *     tags: [Profile Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visitedProfileId
 *             properties:
 *               visitedProfileId:
 *                 type: string
 *                 example: "6870f5d8b2c7a4e1d5f9a123"
 *     responses:
 *       201:
 *         description: Profile visit recorded successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Profile visit recorded successfully.
 *       400:
 *         description: Validation error or cannot visit own profile.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Profile not found.
 */
router.post("/", authenticate, createProfileVisit);
/**
 * @swagger
 * /v1/api/profile-visits/visited:
 *   get:
 *     summary: Get all profiles visited by the logged-in user
 *     tags: [Profile Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of visited profiles retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "68720b8de2b2d1b8f5f9a321"
 *                   viewerProfileId: "68720b8de2b2d1b8f5f9a111"
 *                   visitedProfileId:
 *                     _id: "68720b8de2b2d1b8f5f9a222"
 *                     basicDetails:
 *                       firstName: "Priya"
 *                       lastName: "Sharma"
 *                     educationDetails:
 *                       highestQualification: "MBA"
 *                     locationDetails:
 *                       city: "Mumbai"
 *                       state: "Maharashtra"
 *                   createdAt: "2026-07-09T10:30:00.000Z"
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Profile not found.
 */
router.get("/visited", authenticate, getMyVisitedProfiles);
/**
 * @swagger
 * /v1/api/profile-visits/visitors:
 *   get:
 *     summary: Get all users who visited the logged-in user's profile
 *     tags: [Profile Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of profile visitors retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "68720b8de2b2d1b8f5f9a321"
 *                   viewerProfileId:
 *                     _id: "68720b8de2b2d1b8f5f9a111"
 *                     basicDetails:
 *                       firstName: "Rahul"
 *                       lastName: "Patil"
 *                     educationDetails:
 *                       highestQualification: "B.Tech"
 *                     locationDetails:
 *                       city: "Pune"
 *                       state: "Maharashtra"
 *                   visitedProfileId: "68720b8de2b2d1b8f5f9a222"
 *                   createdAt: "2026-07-09T10:30:00.000Z"
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Profile not found.
 */
router.get("/visitors", authenticate, getProfileVisitors);
// /**
//  * @swagger
//  * /v1/api/profile-visits/{id}:
//  *   delete:
//  *     summary: Delete a profile visit
//  *     tags: [Profile Visits]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         example: "68720b8de2b2d1b8f5f9a321"
//  *     responses:
//  *       200:
//  *         description: Profile visit deleted successfully.
//  *         content:
//  *           application/json:
//  *             example:
//  *               success: true
//  *               message: Profile visit deleted successfully.
//  *       401:
//  *         description: Unauthorized.
//  *       404:
//  *         description: Profile visit not found.
//  */
// router.delete("/:id", authenticate, deleteProfileVisit);

export const profileVisitsRouter = router;