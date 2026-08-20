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
const accountSettings_model_1 = require("../../account-settings/accountSettings.model");
const recommendation_service_1 = require("../../../services/recommendation.service");
const getMyNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
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
        // Get account settings
        const accountSettings = yield accountSettings_model_1.AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
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
        // 4. Recommended profiles
        const recommendedProfiles = yield (0, recommendation_service_1.getRecommended)(loggedInProfile._id.toString());
        // 5. Just Joined profiles - last 24 hours
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const justJoinedProfiles = yield profile_model_1.Profile.find({
            createdAt: {
                $gte: last24Hours,
            },
            isDeleted: false,
            _id: {
                $ne: loggedInProfile._id,
            },
        })
            .select("_id userId matrimonyId basicDetails.firstName basicDetails.lastName photo")
            .lean();
        // 6. Pending interests
        const pendingInterests = yield interest_model_1.Interest.find({
            receiverId: loggedInProfile._id,
            status: "Pending",
            isDeleted: false,
        })
            .select("_id")
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
            // ...profileVisitors.map((visitor: any) => ({
            //     type: "profile_visited",
            //     message: "visited your profile",
            //     data: {
            //         id: visitor.viewerProfileId?._id,
            //         matrimonyId: visitor.viewerProfileId?.matrimonyId,
            //         firstName:
            //             visitor.viewerProfileId?.basicDetails?.firstName,
            //         lastName:
            //             visitor.viewerProfileId?.basicDetails?.lastName,
            //     },
            //     createdAt: visitor.createdAt,
            // })),
        ];
        // Profile Visitors
        // Show in-app notifications only when push notifications are disabled
        if (profileVisitors.length > 0 &&
            ((_b = (_a = accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.notificationSettings) === null || _a === void 0 ? void 0 : _a.appNotifications) === null || _b === void 0 ? void 0 : _b.profileVisitors) === false) {
            notifications.push(...profileVisitors.map((visitor) => {
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
            }));
        }
        // Add recommendation as in-app notification
        // only when push notifications are disabled
        if (recommendedProfiles.length > 0 &&
            ((_d = (_c = accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.notificationSettings) === null || _c === void 0 ? void 0 : _c.appNotifications) === null || _d === void 0 ? void 0 : _d.dailyRecommendations) === false) {
            notifications.push({
                type: "recommended_profiles",
                message: "found recommended profiles for you",
                data: {
                    count: recommendedProfiles.length,
                },
                createdAt: new Date(),
            });
        }
        // Just Joined in-app notification
        // Only when push notifications are disabled
        if (justJoinedProfiles.length > 0 &&
            ((_f = (_e = accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.notificationSettings) === null || _e === void 0 ? void 0 : _e.appNotifications) === null || _f === void 0 ? void 0 : _f.justJoined) === false) {
            notifications.push({
                type: "just_joined",
                message: "new profiles just joined SahaJeevan",
                data: {
                    count: justJoinedProfiles.length,
                },
                createdAt: new Date(),
            });
        }
        // Pending Interests
        // Show in-app notification only when Firebase push is disabled
        if (pendingInterests.length > 0 &&
            ((_h = (_g = accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.notificationSettings) === null || _g === void 0 ? void 0 : _g.appNotifications) === null || _h === void 0 ? void 0 : _h.pendingInterests) === false) {
            notifications.push({
                type: "pending_interests",
                message: "you have pending interest requests",
                data: {
                    count: pendingInterests.length,
                },
                createdAt: new Date(),
            });
        }
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
