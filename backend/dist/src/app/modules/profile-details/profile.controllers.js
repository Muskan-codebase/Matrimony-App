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
exports.getRecommendedMatches = exports.deleteProfile = exports.getProfileById = exports.uploadProfilePhotos = exports.updateProfile = exports.getMyProfile = exports.getProfiles = exports.createProfile = void 0;
const profile_model_1 = require("./profile.model");
const ignore_model_1 = require("./ignore/ignore.model");
const block_model_1 = require("./block/block.model");
const interest_model_1 = require("./interest/interest.model");
const shortlist_model_1 = require("./shortlist/shortlist.model");
const annualIncome_model_1 = require("../admin/annual-income/annualIncome.model");
const partnerPreference_model_1 = require("./partner-preference/partnerPreference.model");
const profile_validation_1 = require("./profile.validation");
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = profile_validation_1.createProfileSchema.parse({
            body: req.body,
        });
        const existingProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: "Profile already exists.",
            });
        }
        const profile = yield profile_model_1.Profile.create(Object.assign({ userId: req.user.id }, validatedData.body));
        return res.status(201).json({
            success: true,
            message: "Profile created successfully.",
            data: profile,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createProfile = createProfile;
// Accepts "Pune,Mumbai,Delhi" OR ?city=Pune&city=Mumbai OR ?city[]=Pune&city[]=Mumbai
// and always returns a clean string[].
const toArray = (value) => {
    if (value === undefined || value === null || value === "")
        return [];
    if (Array.isArray(value)) {
        return value
            .flatMap((v) => String(v).split(","))
            .map((v) => v.trim())
            .filter(Boolean);
    }
    return String(value)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
};
const hasActivePreference = (preferences) => !!preferences && preferences.length > 0 && !preferences.includes("Doesn't Matter");
// Resolves a requested [min, max] income range to every AnnualIncome bracket
// LABEL whose own range overlaps it. A bracket with maxIncome === null is
// treated as open-ended (e.g. "25 LPA and above").
const getMatchingIncomeLabels = (min, max) => __awaiter(void 0, void 0, void 0, function* () {
    if (min === undefined && max === undefined)
        return [];
    const conditions = [{ isDeleted: false }];
    if (max !== undefined) {
        conditions.push({ minIncome: { $lte: max } });
    }
    if (min !== undefined) {
        conditions.push({
            $or: [{ maxIncome: { $gte: min } }, { maxIncome: null }],
        });
    }
    return annualIncome_model_1.AnnualIncome.find({ $and: conditions }).distinct("annualIncome");
});
const getProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19;
    try {
        // 1. Logged-in user's profile
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        // 2. Everyone that should never show up (self, ignored, blocked, already interested/shortlisted)
        const [ignoredIds, blockedIds, blockedMeIds, interestedIds, shortlistedIds] = yield Promise.all([
            ignore_model_1.Ignore.find({ userId: loggedInProfile._id }).distinct("ignoredUserId"),
            block_model_1.Block.find({ userId: loggedInProfile._id }).distinct("blockedUserId"),
            block_model_1.Block.find({ blockedUserId: loggedInProfile._id }).distinct("userId"),
            interest_model_1.Interest.find({ senderId: loggedInProfile._id }).distinct("receiverId"),
            shortlist_model_1.Shortlist.find({ userId: loggedInProfile._id }).distinct("shortlistedUserId"),
        ]);
        const excludedProfileIds = [
            loggedInProfile._id,
            ...ignoredIds,
            ...blockedIds,
            ...blockedMeIds,
            ...interestedIds,
            ...shortlistedIds,
        ];
        const uniqueExcludedIds = [
            ...new Set(excludedProfileIds.map((id) => id.toString())),
        ];
        const filter = {
            isDeleted: false,
            _id: { $nin: uniqueExcludedIds },
        };
        // 3. Explicit query filters (multi-select supported on every list-type field)
        const query = normalizeQueryKeys(req.query);
        const { gender, minAge, maxAge, maritalStatus, height, minHeight, maxHeight, religion, caste, subCaste, hasDosh, motherTongue, highestQualification, educationType, occupation, minIncome, maxIncome, country, state, city, classType, brothers, marriedBrothers, sisters, marriedSisters, livingWithFamily, familyLocation, eatingHabit, nakshatra, rashi, } = query;
        let hasExplicitFilters = false;
        const applyMulti = (field, value) => {
            const arr = toArray(value);
            if (arr.length > 0) {
                filter[field] = { $in: arr };
                hasExplicitFilters = true;
            }
        };
        applyMulti("basicDetails.gender", gender);
        applyMulti("basicDetails.maritalStatus", maritalStatus);
        applyMulti("basicDetails.height", height);
        applyMulti("religionDetails.religion", religion);
        applyMulti("religionDetails.caste", caste);
        applyMulti("religionDetails.subCaste", subCaste);
        applyMulti("religionDetails.motherTongue", motherTongue);
        applyMulti("educationDetails.highestQualification", highestQualification);
        applyMulti("educationDetails.educationType", educationType);
        applyMulti("educationDetails.occupation", occupation);
        // --- Annual Income (explicit min/max query params) ---
        if (minIncome || maxIncome) {
            const matchingIncomeLabels = yield getMatchingIncomeLabels(minIncome ? Number(minIncome) : undefined, maxIncome ? Number(maxIncome) : undefined);
            filter["educationDetails.annualIncome"] = { $in: matchingIncomeLabels };
            hasExplicitFilters = true;
        }
        applyMulti("locationDetails.country", country);
        applyMulti("locationDetails.state", state);
        applyMulti("locationDetails.city", city);
        applyMulti("additionalDetails.classType", classType);
        applyMulti("additionalDetails.brothers", brothers);
        applyMulti("additionalDetails.marriedBrothers", marriedBrothers);
        applyMulti("additionalDetails.sisters", sisters);
        applyMulti("additionalDetails.marriedSisters", marriedSisters);
        applyMulti("additionalDetails.familyLocation", familyLocation);
        applyMulti("lifestyleDetails.eatingHabit", eatingHabit);
        applyMulti("horoscopeDetails.starDetails.nakshatra", nakshatra);
        applyMulti("horoscopeDetails.starDetails.rashi", rashi);
        if (hasDosh !== undefined) {
            filter["religionDetails.hasDosh"] = hasDosh === "true";
            hasExplicitFilters = true;
        }
        if (livingWithFamily !== undefined) {
            filter["additionalDetails.livingWithFamily"] = livingWithFamily === "true";
            hasExplicitFilters = true;
        }
        if (minAge || maxAge) {
            filter["basicDetails.age"] = {};
            if (minAge)
                filter["basicDetails.age"].$gte = Number(minAge);
            if (maxAge)
                filter["basicDetails.age"].$lte = Number(maxAge);
            hasExplicitFilters = true;
        }
        if (minHeight || maxHeight) {
            filter["basicDetails.height"] = Object.assign(Object.assign(Object.assign({}, (filter["basicDetails.height"] || {})), (minHeight ? { $gte: Number(minHeight) } : {})), (maxHeight ? { $lte: Number(maxHeight) } : {}));
            hasExplicitFilters = true;
        }
        // 4. No explicit filters at all → fall back to saved partner preferences
        //    so the default feed is still personalised, not just "everyone".
        if (!hasExplicitFilters) {
            const partnerPreference = yield partnerPreference_model_1.PartnerPreference.findOne({
                profileId: loggedInProfile._id,
                isDeleted: false,
            });
            if (partnerPreference) {
                if (((_b = (_a = partnerPreference.basicDetails) === null || _a === void 0 ? void 0 : _a.age) === null || _b === void 0 ? void 0 : _b.minAge) !== undefined ||
                    ((_d = (_c = partnerPreference.basicDetails) === null || _c === void 0 ? void 0 : _c.age) === null || _d === void 0 ? void 0 : _d.maxAge) !== undefined) {
                    filter["basicDetails.age"] = {};
                    if (partnerPreference.basicDetails.age.minAge !== undefined) {
                        filter["basicDetails.age"].$gte = partnerPreference.basicDetails.age.minAge;
                    }
                    if (partnerPreference.basicDetails.age.maxAge !== undefined) {
                        filter["basicDetails.age"].$lte = partnerPreference.basicDetails.age.maxAge;
                    }
                }
                if (((_f = (_e = partnerPreference.basicDetails) === null || _e === void 0 ? void 0 : _e.height) === null || _f === void 0 ? void 0 : _f.minHeight) ||
                    ((_h = (_g = partnerPreference.basicDetails) === null || _g === void 0 ? void 0 : _g.height) === null || _h === void 0 ? void 0 : _h.maxHeight)) {
                    filter["basicDetails.height"] = Object.assign(Object.assign({}, (partnerPreference.basicDetails.height.minHeight
                        ? { $gte: partnerPreference.basicDetails.height.minHeight }
                        : {})), (partnerPreference.basicDetails.height.maxHeight
                        ? { $lte: partnerPreference.basicDetails.height.maxHeight }
                        : {}));
                }
                if (((_j = partnerPreference.basicDetails.partnerCountry) === null || _j === void 0 ? void 0 : _j.length) > 0) {
                    filter["locationDetails.country"] = { $in: partnerPreference.basicDetails.partnerCountry };
                }
                if (((_k = partnerPreference.basicDetails.partnerState) === null || _k === void 0 ? void 0 : _k.length) > 0) {
                    filter["locationDetails.state"] = { $in: partnerPreference.basicDetails.partnerState };
                }
                if (((_l = partnerPreference.basicDetails.partnerCity) === null || _l === void 0 ? void 0 : _l.length) > 0) {
                    filter["locationDetails.city"] = { $in: partnerPreference.basicDetails.partnerCity };
                }
                if (((_o = (_m = partnerPreference.basicDetails.maritalStatus) === null || _m === void 0 ? void 0 : _m.preferences) === null || _o === void 0 ? void 0 : _o.length) > 0) {
                    filter["basicDetails.maritalStatus"] = {
                        $in: partnerPreference.basicDetails.maritalStatus.preferences,
                    };
                }
                if (!((_p = partnerPreference.educationDetails) === null || _p === void 0 ? void 0 : _p.doesntMatter) &&
                    ((_r = (_q = partnerPreference.educationDetails) === null || _q === void 0 ? void 0 : _q.highestDegrees) === null || _r === void 0 ? void 0 : _r.length) > 0) {
                    filter["educationDetails.highestQualification"] = {
                        $in: partnerPreference.educationDetails.highestDegrees,
                    };
                }
                if (!((_t = (_s = partnerPreference.educationDetails) === null || _s === void 0 ? void 0 : _s.occupation) === null || _t === void 0 ? void 0 : _t.doesntMatter) &&
                    ((_w = (_v = (_u = partnerPreference.educationDetails) === null || _u === void 0 ? void 0 : _u.occupation) === null || _v === void 0 ? void 0 : _v.preferences) === null || _w === void 0 ? void 0 : _w.length) > 0) {
                    filter["educationDetails.occupation"] = {
                        $in: partnerPreference.educationDetails.occupation.preferences,
                    };
                }
                // --- Annual Income (partner preference fallback) ---
                // Stored as a single AnnualIncome _id ref, so match it directly —
                // no range resolution needed here.
                if ((_x = partnerPreference.educationDetails) === null || _x === void 0 ? void 0 : _x.annualIncome) {
                    filter["educationDetails.annualIncome"] = partnerPreference.educationDetails.annualIncome;
                }
                if ((_z = (_y = partnerPreference.religionAndEthnicity) === null || _y === void 0 ? void 0 : _y.religion) === null || _z === void 0 ? void 0 : _z.preference) {
                    filter["religionDetails.religion"] = partnerPreference.religionAndEthnicity.religion.preference;
                }
                if (((_2 = (_1 = (_0 = partnerPreference.religionAndEthnicity) === null || _0 === void 0 ? void 0 : _0.caste) === null || _1 === void 0 ? void 0 : _1.preferences) === null || _2 === void 0 ? void 0 : _2.length) > 0) {
                    filter["religionDetails.caste"] = {
                        $in: partnerPreference.religionAndEthnicity.caste.preferences,
                    };
                }
                if (((_5 = (_4 = (_3 = partnerPreference.religionAndEthnicity) === null || _3 === void 0 ? void 0 : _3.subCaste) === null || _4 === void 0 ? void 0 : _4.preferences) === null || _5 === void 0 ? void 0 : _5.length) > 0) {
                    filter["religionDetails.subCaste"] = {
                        $in: partnerPreference.religionAndEthnicity.subCaste.preferences,
                    };
                }
                if ((_7 = (_6 = partnerPreference.religionAndEthnicity) === null || _6 === void 0 ? void 0 : _6.motherTongue) === null || _7 === void 0 ? void 0 : _7.preference) {
                    filter["religionDetails.motherTongue"] =
                        partnerPreference.religionAndEthnicity.motherTongue.preference;
                }
                if (hasActivePreference((_9 = (_8 = partnerPreference.religionAndEthnicity) === null || _8 === void 0 ? void 0 : _8.manglikStatus) === null || _9 === void 0 ? void 0 : _9.preferences)) {
                    filter["religionDetails.manglik"] = {
                        $in: partnerPreference.religionAndEthnicity.manglikStatus.preferences,
                    };
                }
                if (hasActivePreference((_11 = (_10 = partnerPreference.lifestyleAndAppearance) === null || _10 === void 0 ? void 0 : _10.dietaryHabits) === null || _11 === void 0 ? void 0 : _11.preferences)) {
                    filter["lifestyleDetails.eatingHabit"] = {
                        $in: partnerPreference.lifestyleAndAppearance.dietaryHabits.preferences,
                    };
                }
                if (hasActivePreference((_13 = (_12 = partnerPreference.lifestyleAndAppearance) === null || _12 === void 0 ? void 0 : _12.smokingHabits) === null || _13 === void 0 ? void 0 : _13.preferences)) {
                    filter["additionalDetails.smoking"] = {
                        $in: partnerPreference.lifestyleAndAppearance.smokingHabits.preferences,
                    };
                }
                if (hasActivePreference((_15 = (_14 = partnerPreference.lifestyleAndAppearance) === null || _14 === void 0 ? void 0 : _14.drinkingHabits) === null || _15 === void 0 ? void 0 : _15.preferences)) {
                    filter["additionalDetails.drinking"] = {
                        $in: partnerPreference.lifestyleAndAppearance.drinkingHabits.preferences,
                    };
                }
                if (hasActivePreference((_17 = (_16 = partnerPreference.lifestyleAndAppearance) === null || _16 === void 0 ? void 0 : _16.disability) === null || _17 === void 0 ? void 0 : _17.preferences)) {
                    filter["additionalDetails.disability"] = {
                        $in: partnerPreference.lifestyleAndAppearance.disability.preferences,
                    };
                }
                if ((_19 = (_18 = partnerPreference.familyDetails) === null || _18 === void 0 ? void 0 : _18.familyBasedOutOfCountry) === null || _19 === void 0 ? void 0 : _19.country) {
                    filter["familyDetails.basedOutOfCountry"] =
                        partnerPreference.familyDetails.familyBasedOutOfCountry.country;
                }
            }
        }
        // 5. Fetch
        const profiles = yield profile_model_1.Profile.find(filter);
        return res.status(200).json({
            success: true,
            total: profiles.length,
            data: profiles,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getProfiles = getProfiles;
// export const getProfiles = async (req: Request, res: Response) => {
//     try {
//         const profiles = await Profile.find({
//             isDeleted: false,
//         });
//         return res.status(200).json({
//             success: true,
//             count: profiles.length,
//             data: profiles,
//         });
//     }
//     catch (error: any) {
//         res.status(400).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const profile = yield profile_model_1.Profile.findOne({
            userId: id,
            isDeleted: false,
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: profile,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getMyProfile = getMyProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = profile_validation_1.updateProfileSchema.parse({
            body: req.body,
        });
        const updateData = {};
        Object.keys(validatedData.body)
            .forEach((key) => {
            const value = validatedData.body[key];
            if (value !== undefined && value !== null) {
                updateData[key] = value;
            }
        });
        // Photos
        if (req.files) {
            const files = req.files;
            if (files.length > 0) {
                updateData.photos = files.map((file) => file.path);
            }
        }
        const profile = yield profile_model_1.Profile.findOneAndUpdate({
            userId: req.user.id,
            isDeleted: false,
        }, {
            $set: updateData,
        }, {
            new: true,
            runValidators: true,
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: profile,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateProfile = updateProfile;
// export const updateProfile = async (req: Request, res: Response) => {
//     try {
//         const validatedData = updateProfileSchema.parse({
//             body: req.body,
//         });
//         const profile = await Profile.findOneAndUpdate(
//             {
//                 userId: req.user.id,
//                 isDeleted: false,
//             },
//             {
//                 $set: validatedData.body,
//             },
//             {
//                 new: true,
//             }
//         );
//         if (!profile) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Profile not found.",
//             });
//         }
//         return res.status(200).json({
//             success: true,
//             message: "Profile updated successfully.",
//             data: profile,
//         });
//     }
//     catch (error: any) {
//         res.status(400).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
const uploadProfilePhotos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image.",
            });
        }
        const imageUrls = files.map((file) => file.path);
        const profile = yield profile_model_1.Profile.findOneAndUpdate({
            userId: req.user.id,
            isDeleted: false,
        }, {
            $push: {
                photos: {
                    $each: imageUrls,
                },
            },
        }, {
            new: true,
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Photos uploaded successfully.",
            data: profile,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.uploadProfilePhotos = uploadProfilePhotos;
// Normalizes query keys so "Gender", "MinAge", etc. are treated the same as "gender", "minAge"
const normalizeQueryKeys = (query) => {
    const normalized = {};
    for (const key in query) {
        const normalizedKey = key.replace(/^./, (c) => c.toLowerCase());
        normalized[normalizedKey] = query[key];
    }
    return normalized;
};
// export const filterProfiles = async (req: Request, res: Response) => {
//     try {
//         const query = normalizeQueryKeys(req.query as Record<string, any>);
//         const {
//             gender,
//             minAge,
//             maxAge,
//             maritalStatus,
//             height,
//             religion,
//             caste,
//             subCaste,
//             hasDosh,
//             motherTongue,
//             highestQualification,
//             educationType,
//             occupation,
//             annualIncome,
//             country,
//             state,
//             city,
//             classType,
//             brothers,
//             marriedBrothers,
//             sisters,
//             marriedSisters,
//             livingWithFamily,
//             familyLocation,
//             eatingHabit,
//             nakshatra,
//             rashi,
//         } = query;
//         const filter: any = {
//             isDeleted: false,
//         };
//         if (gender) {
//             filter["basicDetails.gender"] = gender;
//         }
//         if (maritalStatus) {
//             filter["basicDetails.maritalStatus"] = maritalStatus;
//         }
//         if (height) {
//             filter["basicDetails.height"] = height;
//         }
//         if (religion) {
//             filter["religionDetails.religion"] = religion;
//         }
//         if (caste) {
//             filter["religionDetails.caste"] = caste;
//         }
//         if (subCaste) {
//             filter["religionDetails.subCaste"] = subCaste;
//         }
//         if (hasDosh !== undefined) {
//             filter["religionDetails.hasDosh"] = hasDosh === "true";
//         }
//         if (motherTongue) {
//             filter["religionDetails.motherTongue"] = motherTongue;
//         }
//         if (highestQualification) {
//             filter["educationDetails.highestQualification"] = highestQualification;
//         }
//         if (educationType) {
//             filter["educationDetails.educationType"] = educationType;
//         }
//         if (occupation) {
//             filter["educationDetails.occupation"] = occupation;
//         }
//         if (annualIncome) {
//             filter["educationDetails.annualIncome"] = annualIncome;
//         }
//         if (country) {
//             filter["locationDetails.country"] = country;
//         }
//         if (state) {
//             filter["locationDetails.state"] = state;
//         }
//         if (city) {
//             filter["locationDetails.city"] = city;
//         }
//         if (classType) {
//             filter["additionalDetails.classType"] = classType;
//         }
//         if (brothers) {
//             filter["additionalDetails.brothers"] = brothers;
//         }
//         if (marriedBrothers) {
//             filter["additionalDetails.marriedBrothers"] = marriedBrothers;
//         }
//         if (sisters) {
//             filter["additionalDetails.sisters"] = sisters;
//         }
//         if (marriedSisters) {
//             filter["additionalDetails.marriedSisters"] = marriedSisters;
//         }
//         if (livingWithFamily !== undefined) {
//             filter["additionalDetails.livingWithFamily"] =
//                 livingWithFamily === "true";
//         }
//         if (familyLocation) {
//             filter["additionalDetails.familyLocation"] = familyLocation;
//         }
//         if (eatingHabit) {
//             filter["lifestyleDetails.eatingHabit"] = eatingHabit;
//         }
//         if (nakshatra) {
//             filter["horoscopeDetails.starDetails.nakshatra"] = nakshatra;
//         }
//         if (rashi) {
//             filter["horoscopeDetails.starDetails.rashi"] = rashi;
//         }
//         if (minAge || maxAge) {
//             filter["basicDetails.age"] = {};
//             if (minAge) {
//                 filter["basicDetails.age"].$gte = Number(minAge);
//             }
//             if (maxAge) {
//                 filter["basicDetails.age"].$lte = Number(maxAge);
//             }
//         }
//         const profiles = await Profile.find(filter);
//         return res.status(200).json({
//             success: true,
//             total: profiles.length,
//             data: profiles,
//         });
//     }
//     catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
const getProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const profile = yield profile_model_1.Profile.findOne({
            _id: id,
            isDeleted: false,
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: profile,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getProfileById = getProfileById;
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield profile_model_1.Profile.findOneAndUpdate({
            userId: req.user.id,
            isDeleted: false,
        }, {
            isDeleted: true,
        }, {
            new: true,
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully.",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteProfile = deleteProfile;
const getRecommendedMatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Logged in user's profile
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
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
        return res.status(200).json({
            success: true,
            count: filteredProfiles.length,
            data: filteredProfiles,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getRecommendedMatches = getRecommendedMatches;
