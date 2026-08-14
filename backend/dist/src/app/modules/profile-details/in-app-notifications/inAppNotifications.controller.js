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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyNotifications = void 0;
const profile_model_1 = require("../profile.model");
const shortlist_model_1 = require("../shortlist/shortlist.model");
const profileVisits_model_1 = __importDefault(require("../profile-visits/profileVisits.model"));
const interest_model_1 = require("../interest/interest.model");
const getMyNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find logged-in user's profile
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (!loggedInProfile) {
            res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
            return;
        }
        const profileFields = "photo matrimonyId basicDetails.firstName basicDetails.lastName";
        // 1. Interests received by logged-in user
        const receivedInterests = yield interest_model_1.Interest.find({
            receiverId: loggedInProfile._id,
            isDeleted: false,
        })
            .populate({
            path: "senderId",
            model: "Profile",
            select: profileFields,
        })
            .sort({ createdAt: -1 })
            .lean();
        // 2. Users who shortlisted logged-in user
        const shortlistedBy = yield shortlist_model_1.Shortlist.find({
            shortlistedUserId: loggedInProfile._id,
        })
            .populate({
            path: "userId",
            model: "Profile",
            select: profileFields,
        })
            .sort({ createdAt: -1 })
            .lean();
        // 3. Users who visited logged-in user's profile
        const profileVisitors = yield profileVisits_model_1.default.find({
            visitedProfileId: loggedInProfile._id,
        })
            .populate({
            path: "viewerProfileId",
            model: "Profile",
            select: profileFields,
        })
            .sort({ createdAt: -1 })
            .lean();
        // Combine all notifications
        const notifications = [
            ...receivedInterests.map((interest) => ({
                type: "interest_received",
                message: "sent you an interest request",
                data: interest,
                createdAt: interest.createdAt,
            })),
            ...shortlistedBy.map((shortlist) => ({
                type: "profile_shortlisted",
                message: "shortlisted your profile",
                data: shortlist,
                createdAt: shortlist.createdAt,
            })),
            ...profileVisitors.map((visitor) => ({
                type: "profile_visited",
                message: "visited your profile",
                data: visitor,
                createdAt: visitor.createdAt,
            })),
        ];
        // Sort all notification types by latest activity
        notifications.sort((a, b) => new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime());
        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.getMyNotifications = getMyNotifications;
