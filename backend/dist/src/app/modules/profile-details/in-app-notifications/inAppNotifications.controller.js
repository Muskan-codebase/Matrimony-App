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
            ...receivedInterests.map((interest) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    type: "interest_received",
                    message: "sent you an interest request",
                    data: {
                        id: (_a = interest.senderId) === null || _a === void 0 ? void 0 : _a._id,
                        matrimonyId: (_b = interest.senderId) === null || _b === void 0 ? void 0 : _b.matrimonyId,
                        firstName: (_d = (_c = interest.senderId) === null || _c === void 0 ? void 0 : _c.basicDetails) === null || _d === void 0 ? void 0 : _d.firstName,
                        lastName: (_f = (_e = interest.senderId) === null || _e === void 0 ? void 0 : _e.basicDetails) === null || _f === void 0 ? void 0 : _f.lastName,
                    },
                    createdAt: interest.createdAt,
                });
            }),
            ...shortlistedBy.map((shortlist) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    type: "profile_shortlisted",
                    message: "shortlisted your profile",
                    data: {
                        id: (_a = shortlist.userId) === null || _a === void 0 ? void 0 : _a._id,
                        matrimonyId: (_b = shortlist.userId) === null || _b === void 0 ? void 0 : _b.matrimonyId,
                        firstName: (_d = (_c = shortlist.userId) === null || _c === void 0 ? void 0 : _c.basicDetails) === null || _d === void 0 ? void 0 : _d.firstName,
                        lastName: (_f = (_e = shortlist.userId) === null || _e === void 0 ? void 0 : _e.basicDetails) === null || _f === void 0 ? void 0 : _f.lastName,
                    },
                    createdAt: shortlist.createdAt,
                });
            }),
            ...profileVisitors.map((visitor) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    type: "profile_visited",
                    message: "visited your profile",
                    data: {
                        id: (_a = visitor.viewerProfileId) === null || _a === void 0 ? void 0 : _a._id,
                        matrimonyId: (_b = visitor.viewerProfileId) === null || _b === void 0 ? void 0 : _b.matrimonyId,
                        firstName: (_d = (_c = visitor.viewerProfileId) === null || _c === void 0 ? void 0 : _c.basicDetails) === null || _d === void 0 ? void 0 : _d.firstName,
                        lastName: (_f = (_e = visitor.viewerProfileId) === null || _e === void 0 ? void 0 : _e.basicDetails) === null || _f === void 0 ? void 0 : _f.lastName,
                    },
                    createdAt: visitor.createdAt,
                });
            }),
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
