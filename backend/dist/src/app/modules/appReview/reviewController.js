"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppReview = exports.getAppReviews = exports.createAppReview = void 0;
const reviewModel_1 = require("./reviewModel");
const profile_model_1 = require("../profile-details/profile.model");
const reviewValidation_1 = require("./reviewValidation");
const createAppReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authId = req.user.id;
        const parsed = reviewValidation_1.createAppReviewSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: parsed.error.issues[0].message,
                errors: parsed.error.flatten(),
            });
        }
        const profile = yield profile_model_1.Profile.findOne({ userId: authId });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Your profile was not found.',
            });
        }
        const review = yield reviewModel_1.AppReview.create(Object.assign({ profileId: profile._id }, parsed.data));
        return res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review,
        });
    }
    catch (error) {
        console.error('Create App Review Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while submitting the review',
        });
    }
});
exports.createAppReview = createAppReview;
const getAppReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield reviewModel_1.AppReview.find()
            .populate('profileId', 'basicDetails.firstName basicDetails.lastName matrimonyId profilePhoto')
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: 'App reviews fetched successfully',
            data: reviews,
        });
    }
    catch (error) {
        console.error('Get App Reviews Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching reviews',
        });
    }
});
exports.getAppReviews = getAppReviews;
const deleteAppReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedParams = reviewValidation_1.appReviewIdSchema.safeParse(req.params);
        if (!parsedParams.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID',
            });
        }
        const deleted = yield reviewModel_1.AppReview.findByIdAndDelete(parsedParams.data.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete App Review Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while deleting the review',
        });
    }
});
exports.deleteAppReview = deleteAppReview;
