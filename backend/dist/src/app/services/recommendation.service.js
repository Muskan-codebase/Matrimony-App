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
exports.getRecommended = void 0;
const ignore_model_1 = require("../modules/profile-details/ignore/ignore.model");
const block_model_1 = require("../modules/profile-details/block/block.model");
const interest_model_1 = require("../modules/profile-details/interest/interest.model");
const profile_model_1 = require("../modules/profile-details/profile.model");
const getRecommended = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInProfile = yield profile_model_1.Profile.findById(profileId);
    if (!loggedInProfile || loggedInProfile.isDeleted) {
        throw new Error("Your profile was not found.");
    }
    // Ignored profiles
    const ignoredProfileIds = yield ignore_model_1.Ignore.find({
        userId: loggedInProfile._id,
    }).distinct("ignoredUserId");
    // Blocked profiles
    const blockedProfileIds = yield block_model_1.Block.find({
        userId: loggedInProfile._id,
    }).distinct("blockedUserId");
    // Profiles that blocked me
    const blockedMeProfileIds = yield block_model_1.Block.find({
        blockedUserId: loggedInProfile._id,
    }).distinct("userId");
    // Already sent interest
    const interestedProfileIds = yield interest_model_1.Interest.find({
        senderId: loggedInProfile._id,
    }).distinct("receiverId");
    // Excluded profiles
    const excludedIds = [
        loggedInProfile._id,
        ...ignoredProfileIds,
        ...blockedProfileIds,
        ...blockedMeProfileIds,
        ...interestedProfileIds,
    ];
    const uniqueExcludedIds = [
        ...new Set(excludedIds.map((id) => id.toString())),
    ];
    // Fetch remaining profiles
    const profiles = yield profile_model_1.Profile.find({
        _id: {
            $nin: uniqueExcludedIds,
        },
        isDeleted: false,
    });
    const recommendedProfiles = profiles.map((profile) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        let score = 0;
        // Religion
        if (((_a = profile.religionDetails) === null || _a === void 0 ? void 0 : _a.religion) ===
            ((_b = loggedInProfile.religionDetails) === null || _b === void 0 ? void 0 : _b.religion)) {
            score += 20;
        }
        // Mother Tongue
        if (((_c = profile.religionDetails) === null || _c === void 0 ? void 0 : _c.motherTongue) ===
            ((_d = loggedInProfile.religionDetails) === null || _d === void 0 ? void 0 : _d.motherTongue)) {
            score += 15;
        }
        // State
        if (((_e = profile.locationDetails) === null || _e === void 0 ? void 0 : _e.state) ===
            ((_f = loggedInProfile.locationDetails) === null || _f === void 0 ? void 0 : _f.state)) {
            score += 10;
        }
        // City
        if (((_g = profile.locationDetails) === null || _g === void 0 ? void 0 : _g.city) ===
            ((_h = loggedInProfile.locationDetails) === null || _h === void 0 ? void 0 : _h.city)) {
            score += 10;
        }
        // Highest Qualification
        if (((_j = profile.educationDetails) === null || _j === void 0 ? void 0 : _j.highestQualification) ===
            ((_k = loggedInProfile.educationDetails) === null || _k === void 0 ? void 0 : _k.highestQualification)) {
            score += 15;
        }
        // Occupation
        if (((_l = profile.careerDetails) === null || _l === void 0 ? void 0 : _l.occupation) ===
            ((_m = loggedInProfile.careerDetails) === null || _m === void 0 ? void 0 : _m.occupation)) {
            score += 10;
        }
        // Diet
        if (((_o = profile.lifestyle) === null || _o === void 0 ? void 0 : _o.dietaryHabit) ===
            ((_p = loggedInProfile.lifestyle) === null || _p === void 0 ? void 0 : _p.dietaryHabit)) {
            score += 5;
        }
        // Drinking
        if (((_q = profile.lifestyle) === null || _q === void 0 ? void 0 : _q.drinkingHabit) ===
            ((_r = loggedInProfile.lifestyle) === null || _r === void 0 ? void 0 : _r.drinkingHabit)) {
            score += 3;
        }
        // Smoking
        if (((_s = profile.lifestyle) === null || _s === void 0 ? void 0 : _s.smokingHabit) ===
            ((_t = loggedInProfile.lifestyle) === null || _t === void 0 ? void 0 : _t.smokingHabit)) {
            score += 3;
        }
        // Family Status
        if (((_u = profile.family) === null || _u === void 0 ? void 0 : _u.familyStatus) ===
            ((_v = loggedInProfile.family) === null || _v === void 0 ? void 0 : _v.familyStatus)) {
            score += 5;
        }
        // Rashi
        if (((_x = (_w = profile.horoscopeDetails) === null || _w === void 0 ? void 0 : _w.starDetails) === null || _x === void 0 ? void 0 : _x.rashi) ===
            ((_z = (_y = loggedInProfile.horoscopeDetails) === null || _y === void 0 ? void 0 : _y.starDetails) === null || _z === void 0 ? void 0 : _z.rashi)) {
            score += 8;
        }
        // Age Difference
        const ageDifference = Math.abs(profile.basicDetails.age -
            loggedInProfile.basicDetails.age);
        if (ageDifference <= 2) {
            score += 15;
        }
        else if (ageDifference <= 5) {
            score += 10;
        }
        // Maximum possible score = 104
        const matchPercentage = Math.round((score / 104) * 100);
        return {
            matchPercentage,
            profile,
        };
    });
    const filteredProfiles = recommendedProfiles
        .filter((profile) => profile.matchPercentage >= 50)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 20);
    return filteredProfiles;
});
exports.getRecommended = getRecommended;
