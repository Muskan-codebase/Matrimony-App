import { Router } from "express";
import {
    addProfile,
    updateProfile,
    getAllProfiles,
    getProfileById,
    deleteProfile,
} from "./profile.controller";
import { authenticate } from "../../../middlewares/authMiddleware";
import { upload } from "../../../config/cloudinary";

const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Admin - Profile Details
 *     description: Admin profile management APIs
 */

/**
 * @swagger
 * /v1/api/admin/profile:
 *   post:
 *     summary: Add Profile
 *     tags: [Admin - Profile Details]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   basicDetails:
 *                     type: object
 *                     properties:
 *                       profileFor:
 *                         type: string
 *                       gender:
 *                         type: string
 *                         enum: [Male, Female]
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       dob:
 *                         type: string
 *                         format: date
 *                       age:
 *                         type: number
 *                       height:
 *                         type: string
 *                       maritalStatus:
 *                         type: string
 *                         enum: [Never Married, Divorced, Widowed, Awaiting Divorce]
 *
 *                   educationDetails:
 *                     type: object
 *                     properties:
 *                       highestQualification:
 *                         type: string
 *                       educationType:
 *                         type: string
 *                       occupation:
 *                         type: string
 *                       annualIncome:
 *                         type: string
 *
 *                   education:
 *                     type: object
 *                     properties:
 *                       aboutEducation:
 *                         type: string
 *                       highestDegree:
 *                         type: string
 *                       postGraduation:
 *                         type: string
 *                       underGraduation:
 *                         type: string
 *                       school:
 *                         type: string
 *
 *                   careerDetails:
 *                     type: object
 *                     properties:
 *                       employedIn:
 *                         type: string
 *                       occupation:
 *                         type: string
 *                       organizationName:
 *                         type: string
 *                       interestedInSettlingAbroad:
 *                         type: boolean
 *
 *                   religionDetails:
 *                     type: object
 *                     properties:
 *                       religion:
 *                         type: string
 *                       caste:
 *                         type: string
 *                       subCaste:
 *                         type: string
 *                       hasDosh:
 *                         type: boolean
 *                       motherTongue:
 *                         type: string
 *
 *                   locationDetails:
 *                     type: object
 *                     properties:
 *                       country:
 *                         type: string
 *                       state:
 *                         type: string
 *                       city:
 *                         type: string
 *
 *                   additionalDetails:
 *                     type: object
 *                     properties:
 *                       classType:
 *                         type: string
 *                         enum: [Middle Class, Upper Middle Class, Rich, Affluent, Elite]
 *                       brothers:
 *                         type: string
 *                         enum: [None, "1", "2", "3", "3+"]
 *                       marriedBrothers:
 *                         type: string
 *                         enum: [None, "1", "2", "3", "3+"]
 *                       sisters:
 *                         type: string
 *                         enum: [None, "1", "2", "3", "3+"]
 *                       marriedSisters:
 *                         type: string
 *                         enum: [None, "1", "2", "3", "3+"]
 *                       livingWithFamily:
 *                         type: boolean
 *                       familyLocation:
 *                         type: string
 *
 *                   horoscopeDetails:
 *                     type: object
 *                     properties:
 *                       birthTime:
 *                         type: object
 *                         properties:
 *                           hour:
 *                             type: number
 *                           minute:
 *                             type: number
 *                           meridiem:
 *                             type: string
 *                             enum: [AM, PM]
 *                       birthPlace:
 *                         type: object
 *                         properties:
 *                           country:
 *                             type: string
 *                           state:
 *                             type: string
 *                           city:
 *                             type: string
 *                       starDetails:
 *                         type: object
 *                         properties:
 *                           nakshatra:
 *                             type: string
 *                           rashi:
 *                             type: string
 *
 *                   lifestyleDetails:
 *                     type: object
 *                     properties:
 *                       eatingHabit:
 *                         type: string
 *                         enum: [Vegetarian, Non Vegetarian, Eggitarian]
 *
 *                   family:
 *                     type: object
 *                     properties:
 *                       aboutFamily:
 *                         type: string
 *                       fatherOccupation:
 *                         type: string
 *                       motherOccupation:
 *                         type: string
 *                       brothers:
 *                         type: string
 *                       sisters:
 *                         type: string
 *                       familyIncome:
 *                         type: string
 *                       familyStatus:
 *                         type: string
 *                         enum: [Middle Class, Upper Middle Class, Rich, Affluent, Elite]
 *                       familyType:
 *                         type: string
 *                       familyValue:
 *                         type: string
 *                       livingWithParents:
 *                         type: boolean
 *                       familyBasedOutOf:
 *                         type: string
 *
 *                   contactDetails:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         format: email
 *                       alternateEmail:
 *                         type: string
 *                         format: email
 *                       phoneNumber:
 *                         type: string
 *                       alternatePhoneNumber:
 *                         type: string
 *                       landlineNumber:
 *                         type: string
 *                       relationshipWithBrideOrGroom:
 *                         type: string
 *
 *                   lifestyle:
 *                     type: object
 *                     properties:
 *                       dietaryHabit:
 *                         type: string
 *                         enum: [Vegetarian, Non Vegetarian, Eggitarian]
 *                       drinkingHabit:
 *                         type: string
 *                         enum: [Never, Occasionally, Regularly]
 *                       smokingHabit:
 *                         type: string
 *                         enum: [Never, Occasionally, Regularly]
 *                       openToPets:
 *                         type: boolean
 *                       ownHouse:
 *                         type: boolean
 *                       ownCar:
 *                         type: boolean
 *                       foodICook:
 *                         type: string
 *                       hobbies:
 *                         type: array
 *                         items:
 *                           type: string
 *                       favouriteMusic:
 *                         type: array
 *                         items:
 *                           type: string
 *                       favouriteBooks:
 *                         type: array
 *                         items:
 *                           type: string
 *                       dressStyle:
 *                         type: string
 *                       sports:
 *                         type: array
 *                         items:
 *                           type: string
 *                       cuisine:
 *                         type: array
 *                         items:
 *                           type: string
 *                       movies:
 *                         type: array
 *                         items:
 *                           type: string
 *                       favouriteRead:
 *                         type: array
 *                         items:
 *                           type: string
 *                       tvShow:
 *                         type: array
 *                         items:
 *                           type: string
 *
 *                   aboutMe:
 *                     type: object
 *                     properties:
 *                       about:
 *                         type: string
 *                         maxLength: 1000
 *                       describeYourself:
 *                         type: string
 *                         maxLength: 100
 *                       profileCreatedBy:
 *                         type: string
 *                       languagesISpeak:
 *                         type: array
 *                         items:
 *                           type: string
 *                       disability:
 *                         type: string
 *                       thalassemia:
 *                         type: string
 *                       hivStatus:
 *                         type: boolean
 *
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: string
 *
 *               photos:
 *                 type: array
 *                 maxItems: 6
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Profile added successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to add profile
 */
router.post("/", authenticate, upload.array("photos", 6), addProfile);
/**
 * @swagger
 * /v1/api/admin/profile/{id}:
 *   put:
 *     summary: Update Profile
 *     tags: [Admin - Profile Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   basicDetails:
 *                     type: object
 *                     properties:
 *                       profileFor:
 *                         type: string
 *                       gender:
 *                         type: string
 *                         enum: [Male, Female]
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       dob:
 *                         type: string
 *                         format: date
 *                       age:
 *                         type: number
 *                       height:
 *                         type: string
 *                       maritalStatus:
 *                         type: string
 *                         enum: [Never Married, Divorced, Widowed, Awaiting Divorce]
 *                   educationDetails:
 *                     type: object
 *                     properties:
 *                       highestQualification:
 *                         type: string
 *                       educationType:
 *                         type: string
 *                       occupation:
 *                         type: string
 *                       annualIncome:
 *                         type: string
 *                   education:
 *                     type: object
 *                     properties:
 *                       aboutEducation:
 *                         type: string
 *                       highestDegree:
 *                         type: string
 *                       postGraduation:
 *                         type: string
 *                       underGraduation:
 *                         type: string
 *                       school:
 *                         type: string
 *                   careerDetails:
 *                     type: object
 *                     properties:
 *                       employedIn:
 *                         type: string
 *                       occupation:
 *                         type: string
 *                       organizationName:
 *                         type: string
 *                       interestedInSettlingAbroad:
 *                         type: boolean
 *                   religionDetails:
 *                     type: object
 *                     properties:
 *                       religion:
 *                         type: string
 *                       caste:
 *                         type: string
 *                       subCaste:
 *                         type: string
 *                       hasDosh:
 *                         type: boolean
 *                       motherTongue:
 *                         type: string
 *                   locationDetails:
 *                     type: object
 *                     properties:
 *                       country:
 *                         type: string
 *                       state:
 *                         type: string
 *                       city:
 *                         type: string
 *                   additionalDetails:
 *                     type: object
 *                     properties:
 *                       classType:
 *                         type: string
 *                       brothers:
 *                         type: string
 *                       marriedBrothers:
 *                         type: string
 *                       sisters:
 *                         type: string
 *                       marriedSisters:
 *                         type: string
 *                       livingWithFamily:
 *                         type: boolean
 *                       familyLocation:
 *                         type: string
 *                   horoscopeDetails:
 *                     type: object
 *                     properties:
 *                       birthTime:
 *                         type: object
 *                       birthPlace:
 *                         type: object
 *                       starDetails:
 *                         type: object
 *                   lifestyleDetails:
 *                     type: object
 *                     properties:
 *                       eatingHabit:
 *                         type: string
 *                   family:
 *                     type: object
 *                   contactDetails:
 *                     type: object
 *                   lifestyle:
 *                     type: object
 *                   aboutMe:
 *                     type: object
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: string
 *               photos:
 *                 type: array
 *                 maxItems: 6
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Failed to update profile
 */
router.put("/:id", authenticate, upload.array("photos", 6), updateProfile);
/**
 * @swagger
 * /v1/api/admin/profile:
 *   get:
 *     summary: Get all profiles
 *     description: Fetch all active profiles with pagination.
 *     tags: [Admin - Profile Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Number of profiles per page
 *     responses:
 *       200:
 *         description: Profiles fetched successfully
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
 *                   example: Profiles fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Profile'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalProfiles:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Invalid pagination parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch profiles
 */
router.get("/", getAllProfiles)
/**
 * @swagger
 * /v1/api/admin/profile/{id}:
 *   get:
 *     summary: Get profile by ID
 *     description: Fetch a single profile by its MongoDB ID.
 *     tags:
 *       - Admin - Profile Details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile MongoDB ID
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       400:
 *         description: Invalid profile ID
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Failed to fetch profile
 */
router.get("/:id", authenticate, getProfileById);
/**
 * @swagger
 * /v1/api/admin/profile/{id}:
 *   delete:
 *     summary: Delete profile
 *     description: Soft delete a profile by its MongoDB ID.
 *     tags:
 *       - Admin - Profile Details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile MongoDB ID
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       400:
 *         description: Invalid profile ID
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Failed to delete profile
 */
router.delete("/:id", authenticate, deleteProfile);

export const adminProfileRouter = router;