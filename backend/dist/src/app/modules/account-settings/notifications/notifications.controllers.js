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
exports.sendSimilarProfilesNotifications = exports.pendingInterestNotification = exports.sendJustJoinedNotifications = void 0;
const profile_model_1 = require("../../profile-details/profile.model");
const interest_model_1 = require("../../profile-details/interest/interest.model");
const accountSettings_model_1 = require("../accountSettings.model");
const sendNotification_service_1 = require("../../../services/sendNotification.service");
const partnerPreference_model_1 = require("../../profile-details/partner-preference/partnerPreference.model");
const sendJustJoinedNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Profiles joined in the last 24 hours
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const justJoinedProfiles = yield profile_model_1.Profile.find({
            createdAt: {
                $gte: last24Hours,
            },
            isDeleted: false,
        }).select("_id userId basicDetails.firstName basicDetails.lastName");
        if (justJoinedProfiles.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No new profiles found.",
                count: 0,
            });
        }
        // Get users who have Just Joined notifications enabled
        const accountSettings = yield accountSettings_model_1.AccountSettings.find({
            isDeleted: false,
            "notificationSettings.appNotifications.justJoined": true,
        }).select("userId");
        let notificationsSent = 0;
        // Send notification to each eligible user
        for (const settings of accountSettings) {
            const userId = settings.userId.toString();
            // Don't notify the user about their own profile
            const newProfilesForUser = justJoinedProfiles.filter((profile) => profile.userId.toString() !== userId);
            if (newProfilesForUser.length === 0) {
                continue;
            }
            yield (0, sendNotification_service_1.sendNotification)({
                receiverId: userId,
                title: "New Profiles Just Joined",
                body: `${newProfilesForUser.length} new profiles just joined SahaJeevan.`,
                data: {
                    type: "just_joined",
                    count: newProfilesForUser.length.toString(),
                },
            });
            notificationsSent++;
        }
        return res.status(200).json({
            success: true,
            message: "Just Joined notifications sent successfully.",
            newProfiles: justJoinedProfiles.length,
            notificationsSent,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.sendJustJoinedNotifications = sendJustJoinedNotifications;
const pendingInterestNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Get users who enabled Pending Interest notifications
        const accountSettings = yield accountSettings_model_1.AccountSettings.find({
            isDeleted: false,
            "notificationSettings.appNotifications.pendingInterests": true,
        })
            .select("userId")
            .lean();
        if (accountSettings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No users have pending interest notifications enabled.",
                notificationsSent: 0,
            });
        }
        const userIds = accountSettings.map((settings) => settings.userId);
        // 2. Get all eligible profiles in ONE query
        const profiles = yield profile_model_1.Profile.find({
            userId: { $in: userIds },
            isDeleted: false,
        })
            .select("_id userId")
            .lean();
        if (profiles.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No eligible profiles found.",
                notificationsSent: 0,
            });
        }
        // Map profileId → userId
        const profileToUserMap = new Map(profiles.map((profile) => [
            profile._id.toString(),
            profile.userId.toString(),
        ]));
        const profileIds = profiles.map((profile) => profile._id);
        // 3. Get ALL pending interests in ONE query
        const pendingInterests = yield interest_model_1.Interest.find({
            receiverId: { $in: profileIds },
            status: "Pending",
            isDeleted: false,
        })
            .select("receiverId")
            .lean();
        // Count pending interests by receiver profile
        const pendingCountMap = new Map();
        for (const interest of pendingInterests) {
            const receiverId = interest.receiverId.toString();
            pendingCountMap.set(receiverId, (pendingCountMap.get(receiverId) || 0) + 1);
        }
        let notificationsSent = 0;
        // Send notifications
        for (const profile of profiles) {
            const profileId = profile._id.toString();
            const pendingCount = pendingCountMap.get(profileId) || 0;
            if (pendingCount === 0) {
                continue;
            }
            const userId = profileToUserMap.get(profileId);
            if (!userId) {
                continue;
            }
            yield (0, sendNotification_service_1.sendNotification)({
                receiverId: userId,
                title: "Pending Interest Requests",
                body: `You have ${pendingCount} pending interest request${pendingCount > 1 ? "s" : ""}.`,
                data: {
                    type: "pending_interests",
                    count: pendingCount.toString(),
                },
            });
            notificationsSent++;
        }
        return res.status(200).json({
            success: true,
            message: "Pending interest notifications sent successfully.",
            notificationsSent,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.pendingInterestNotification = pendingInterestNotification;
const sendSimilarProfilesNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    try {
        //Get users who enabled account settings similar profiles
        const accountSettings = yield accountSettings_model_1.AccountSettings.find({
            isDeleted: false,
            "notificationSettings.appNotifications.similarProfiles": true,
        }).select("userId").lean();
        if (accountSettings.length === 0) {
            res.status(400).json({
                success: false,
                message: "No users have similar profile notifications enabled",
                notificationSent: 0
            });
            return;
        }
        const userIds = accountSettings.map((settings) => settings.userId);
        //Get profiles of those User Ids
        const userProfiles = yield profile_model_1.Profile.find({
            userId: { $in: userIds },
            isDeleted: false
        }).select("_id userId").lean();
        if (userProfiles.length === 0) {
            res.status(400).json({
                success: false,
                message: "No eligible profiles found"
            });
            return;
        }
        // Map profileId -> profile
        // This avoids .find() inside the loop.
        const profileMap = new Map(userProfiles.map((profile) => [
            profile._id.toString(),
            profile,
        ]));
        const profileIds = userProfiles.map((profile) => profile._id);
        // =====================================================
        // 3. Get Partner Preferences
        // =====================================================
        const partnerPreferences = yield partnerPreference_model_1.PartnerPreference.find({
            profileId: { $in: profileIds },
            isDeleted: false,
        })
            .lean();
        if (partnerPreferences.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No partner preferences found.",
                notificationsSent: 0,
            });
        }
        // =====================================================
        // 4. Get ALL candidate profiles in ONE query
        // =====================================================
        const candidateProfiles = yield profile_model_1.Profile.find({
            isDeleted: false,
            isBlocked: false,
        })
            .select("_id userId basicDetails educationDetails religionDetails locationDetails lifestyleDetails aboutMe")
            .lean();
        if (candidateProfiles.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No candidate profiles found.",
                notificationsSent: 0,
            });
        }
        // =====================================================
        // 5. Match profiles in memory
        // =====================================================
        let notificationsSent = 0;
        let totalMatchingProfiles = 0;
        for (const preference of partnerPreferences) {
            const userProfile = profileMap.get(preference.profileId.toString());
            if (!userProfile) {
                continue;
            }
            const userId = userProfile.userId.toString();
            const minAge = (_b = (_a = preference.basicDetails) === null || _a === void 0 ? void 0 : _a.age) === null || _b === void 0 ? void 0 : _b.minAge;
            const maxAge = (_d = (_c = preference.basicDetails) === null || _c === void 0 ? void 0 : _c.age) === null || _d === void 0 ? void 0 : _d.maxAge;
            const preferredCountries = ((_e = preference.basicDetails) === null || _e === void 0 ? void 0 : _e.partnerCountry) || [];
            const preferredStates = ((_f = preference.basicDetails) === null || _f === void 0 ? void 0 : _f.partnerState) || [];
            const preferredCities = ((_g = preference.basicDetails) === null || _g === void 0 ? void 0 : _g.partnerCity) || [];
            const preferredMaritalStatuses = ((_j = (_h = preference.basicDetails) === null || _h === void 0 ? void 0 : _h.maritalStatus) === null || _j === void 0 ? void 0 : _j.preferences) || [];
            const preferredDietaryHabits = ((_l = (_k = preference.lifestyleAndAppearance) === null || _k === void 0 ? void 0 : _k.dietaryHabits) === null || _l === void 0 ? void 0 : _l.preferences) || [];
            const preferredSmokingHabits = ((_o = (_m = preference.lifestyleAndAppearance) === null || _m === void 0 ? void 0 : _m.smokingHabits) === null || _o === void 0 ? void 0 : _o.preferences) || [];
            const preferredDrinkingHabits = ((_q = (_p = preference.lifestyleAndAppearance) === null || _p === void 0 ? void 0 : _p.drinkingHabits) === null || _q === void 0 ? void 0 : _q.preferences) || [];
            const matchingProfiles = candidateProfiles.filter((candidate) => {
                // -----------------------------------------
                // Don't match user's own profile
                // -----------------------------------------
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if (candidate.userId.toString() === userId) {
                    return false;
                }
                // -----------------------------------------
                // Age
                // -----------------------------------------
                const candidateAge = (_a = candidate.basicDetails) === null || _a === void 0 ? void 0 : _a.age;
                if (minAge !== undefined &&
                    candidateAge !== undefined &&
                    candidateAge < minAge) {
                    return false;
                }
                if (maxAge !== undefined &&
                    candidateAge !== undefined &&
                    candidateAge > maxAge) {
                    return false;
                }
                // -----------------------------------------
                // Country
                // -----------------------------------------
                if (preferredCountries.length > 0 &&
                    !preferredCountries.includes(((_b = candidate.locationDetails) === null || _b === void 0 ? void 0 : _b.country) || "")) {
                    return false;
                }
                // -----------------------------------------
                // State
                // -----------------------------------------
                if (preferredStates.length > 0 &&
                    !preferredStates.includes(((_c = candidate.locationDetails) === null || _c === void 0 ? void 0 : _c.state) || "")) {
                    return false;
                }
                // -----------------------------------------
                // City
                // -----------------------------------------
                if (preferredCities.length > 0 &&
                    !preferredCities.includes(((_d = candidate.locationDetails) === null || _d === void 0 ? void 0 : _d.city) || "")) {
                    return false;
                }
                // -----------------------------------------
                // Marital Status
                // -----------------------------------------
                if (preferredMaritalStatuses.length > 0) {
                    const candidateStatus = (_e = candidate.basicDetails) === null || _e === void 0 ? void 0 : _e.maritalStatus;
                    const statusMap = {
                        "Divorced": "Divorce",
                        "Widowed": "Widow",
                    };
                    const normalizedStatus = statusMap[candidateStatus || ""] ||
                        candidateStatus;
                    if (!preferredMaritalStatuses.includes(normalizedStatus)) {
                        return false;
                    }
                }
                // -----------------------------------------
                // Dietary Habit
                // -----------------------------------------
                if (preferredDietaryHabits.length > 0 &&
                    !preferredDietaryHabits.includes("Doesn't Matter")) {
                    const candidateDiet = (_f = candidate.lifestyleDetails) === null || _f === void 0 ? void 0 : _f.eatingHabit;
                    if (!preferredDietaryHabits.includes(candidateDiet)) {
                        return false;
                    }
                }
                // -----------------------------------------
                // Smoking Habit
                // -----------------------------------------
                if (preferredSmokingHabits.length > 0 &&
                    !preferredSmokingHabits.includes("Doesn't Matter")) {
                    const candidateSmoking = (_g = candidate.lifestyle) === null || _g === void 0 ? void 0 : _g.smokingHabit;
                    const smokingMap = {
                        Never: "No",
                        Occasionally: "Occasionally",
                        Regularly: "Yes",
                    };
                    const normalizedSmoking = smokingMap[candidateSmoking || ""];
                    if (!preferredSmokingHabits.includes(normalizedSmoking)) {
                        return false;
                    }
                }
                // -----------------------------------------
                // Drinking Habit
                // -----------------------------------------
                if (preferredDrinkingHabits.length > 0 &&
                    !preferredDrinkingHabits.includes("Doesn't Matter")) {
                    const candidateDrinking = (_h = candidate.lifestyle) === null || _h === void 0 ? void 0 : _h.drinkingHabit;
                    const drinkingMap = {
                        Never: "No",
                        Occasionally: "Occasionally",
                        Regularly: "Yes",
                    };
                    const normalizedDrinking = drinkingMap[candidateDrinking || ""];
                    if (!preferredDrinkingHabits.includes(normalizedDrinking)) {
                        return false;
                    }
                }
                // All preference conditions passed
                return true;
            });
            // =================================================
            // 6. No matching profiles
            // =================================================
            if (matchingProfiles.length === 0) {
                continue;
            }
            totalMatchingProfiles +=
                matchingProfiles.length;
            // =================================================
            // 7. Send notification
            // =================================================
            const count = matchingProfiles.length;
            yield (0, sendNotification_service_1.sendNotification)({
                receiverId: userId,
                title: "Similar Profiles Found",
                body: count === 1
                    ? "1 profile matching your preferences is available."
                    : `${count} profiles matching your preferences are available.`,
                data: {
                    type: "similar_profiles",
                    count: count.toString(),
                },
            });
            notificationsSent++;
        }
        // =====================================================
        // 8. Response
        // =====================================================
        return res.status(200).json({
            success: true,
            message: "Similar profile notifications sent successfully.",
            notificationsSent,
            totalMatchingProfiles,
        });
    }
    catch (error) {
        console.error("Similar profile notification error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.sendSimilarProfilesNotifications = sendSimilarProfilesNotifications;
