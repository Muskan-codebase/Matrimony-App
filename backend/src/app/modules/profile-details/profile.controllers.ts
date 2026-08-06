import { Types } from "mongoose";
import { Request, Response } from "express";
import { Profile } from "./profile.model";
import { Ignore } from "./ignore/ignore.model";
import { Block } from "./block/block.model";
import { Interest } from "./interest/interest.model";
import { Shortlist } from "./shortlist/shortlist.model";
import { AnnualIncome } from "../admin/annual-income/annualIncome.model";
import { PartnerPreference } from "./partner-preference/partnerPreference.model";
import { createProfileSchema, updateProfileSchema } from "./profile.validation";
import { generateMatrimonyId } from "../../utils/counter/counter.service";

export const createProfile = async (req: Request, res: Response) => {

    try {

        const validatedData = createProfileSchema.parse({
            body: req.body,
        });

        const existingProfile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: "Profile already exists.",
            });
        }

        // Generate profile ID
        const matrimonyId = await generateMatrimonyId();

        const profile = await Profile.create({
            userId: req.user.id,
            matrimonyId,
            ...validatedData.body,
        });

        return res.status(201).json({
            success: true,
            message: "Profile created successfully.",
            data: profile,
        });
    }

    catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

// Accepts "Pune,Mumbai,Delhi" OR ?city=Pune&city=Mumbai OR ?city[]=Pune&city[]=Mumbai
// and always returns a clean string[].
const toArray = (value: any): string[] => {
    if (value === undefined || value === null || value === "") return [];
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

const hasActivePreference = (preferences?: string[]) =>
    !!preferences && preferences.length > 0 && !preferences.includes("Doesn't Matter");

// Resolves a requested [min, max] income range to every AnnualIncome bracket
// LABEL whose own range overlaps it. A bracket with maxIncome === null is
// treated as open-ended (e.g. "25 LPA and above").
const getMatchingIncomeLabels = async (
    min?: number,
    max?: number
): Promise<string[]> => {
    if (min === undefined && max === undefined) return [];

    const conditions: any[] = [{ isDeleted: false }];

    if (max !== undefined) {
        conditions.push({ minIncome: { $lte: max } });
    }
    if (min !== undefined) {
        conditions.push({
            $or: [{ maxIncome: { $gte: min } }, { maxIncome: null }],
        });
    }

    return AnnualIncome.find({ $and: conditions }).distinct("annualIncome");
};

export const getProfiles = async (req: Request, res: Response) => {
    try {
        // 1. Logged-in user's profile
        const loggedInProfile = await Profile.findOne({
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
        const [ignoredIds, blockedIds, blockedMeIds, interestedIds, shortlistedIds] =
            await Promise.all([
                Ignore.find({ userId: loggedInProfile._id }).distinct("ignoredUserId"),
                Block.find({ userId: loggedInProfile._id }).distinct("blockedUserId"),
                Block.find({ blockedUserId: loggedInProfile._id }).distinct("userId"),
                Interest.find({ senderId: loggedInProfile._id }).distinct("receiverId"),
                Shortlist.find({ userId: loggedInProfile._id }).distinct("shortlistedUserId"),
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

        const filter: any = {
            isDeleted: false,
            _id: { $nin: uniqueExcludedIds },
        };

        // 3. Explicit query filters (multi-select supported on every list-type field)
        const query = normalizeQueryKeys(req.query as Record<string, any>);

        const {
            matchPreference,
            gender,
            minAge,
            maxAge,
            maritalStatus,
            height,
            minHeight,
            maxHeight,
            religion,
            caste,
            subCaste,
            hasDosh,
            motherTongue,
            highestQualification,
            educationType,
            occupation,
            minIncome,
            maxIncome,
            country,
            state,
            city,
            classType,
            brothers,
            marriedBrothers,
            sisters,
            marriedSisters,
            livingWithFamily,
            familyLocation,
            eatingHabit,
            nakshatra,
            rashi,
        } = query;

        // Match preference for multiple filters
        const matchPreferences = toArray(matchPreference);

        let hasExplicitFilters = false;

        const applyMulti = (field: string, value: any) => {
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
            const matchingIncomeLabels = await getMatchingIncomeLabels(
                minIncome ? Number(minIncome) : undefined,
                maxIncome ? Number(maxIncome) : undefined
            );

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
            if (minAge) filter["basicDetails.age"].$gte = Number(minAge);
            if (maxAge) filter["basicDetails.age"].$lte = Number(maxAge);
            hasExplicitFilters = true;
        }

        if (minHeight || maxHeight) {
            filter["basicDetails.height"] = {
                ...(filter["basicDetails.height"] || {}),
                ...(minHeight ? { $gte: Number(minHeight) } : {}),
                ...(maxHeight ? { $lte: Number(maxHeight) } : {}),
            };
            hasExplicitFilters = true;
        }

        // Feed tabs
        if (matchPreferences.includes("verified")) {
            filter.isVerified = true;
            hasExplicitFilters = true;
        }

        if (matchPreferences.includes("justJoined")) {
            const last24Hours = new Date(
                Date.now() - 24 * 60 * 60 * 1000
            );

            filter.createdAt = {
                $gte: last24Hours,
            };

            hasExplicitFilters = true;
        }

        // 4. No explicit filters at all → fall back to saved partner preferences
        //    so the default feed is still personalised, not just "everyone".
        if (!hasExplicitFilters) {
            const partnerPreference = await PartnerPreference.findOne({
                profileId: loggedInProfile._id,
                isDeleted: false,
            });

            if (partnerPreference) {
                if (
                    partnerPreference.basicDetails?.age?.minAge !== undefined ||
                    partnerPreference.basicDetails?.age?.maxAge !== undefined
                ) {
                    filter["basicDetails.age"] = {};
                    if (partnerPreference.basicDetails.age.minAge !== undefined) {
                        filter["basicDetails.age"].$gte = partnerPreference.basicDetails.age.minAge;
                    }
                    if (partnerPreference.basicDetails.age.maxAge !== undefined) {
                        filter["basicDetails.age"].$lte = partnerPreference.basicDetails.age.maxAge;
                    }
                }

                if (
                    partnerPreference.basicDetails?.height?.minHeight ||
                    partnerPreference.basicDetails?.height?.maxHeight
                ) {
                    filter["basicDetails.height"] = {
                        ...(partnerPreference.basicDetails.height.minHeight
                            ? { $gte: partnerPreference.basicDetails.height.minHeight }
                            : {}),
                        ...(partnerPreference.basicDetails.height.maxHeight
                            ? { $lte: partnerPreference.basicDetails.height.maxHeight }
                            : {}),
                    };
                }

                if (partnerPreference.basicDetails.partnerCountry?.length > 0) {
                    filter["locationDetails.country"] = { $in: partnerPreference.basicDetails.partnerCountry };
                }

                if (partnerPreference.basicDetails.partnerState?.length > 0) {
                    filter["locationDetails.state"] = { $in: partnerPreference.basicDetails.partnerState };
                }

                if (partnerPreference.basicDetails.partnerCity?.length > 0) {
                    filter["locationDetails.city"] = { $in: partnerPreference.basicDetails.partnerCity };
                }

                if (partnerPreference.basicDetails.maritalStatus?.preferences?.length > 0) {
                    filter["basicDetails.maritalStatus"] = {
                        $in: partnerPreference.basicDetails.maritalStatus.preferences,
                    };
                }

                if (
                    !partnerPreference.educationDetails?.doesntMatter &&
                    partnerPreference.educationDetails?.highestDegrees?.length > 0
                ) {
                    filter["educationDetails.highestQualification"] = {
                        $in: partnerPreference.educationDetails.highestDegrees,
                    };
                }

                if (
                    !partnerPreference.educationDetails?.occupation?.doesntMatter &&
                    partnerPreference.educationDetails?.occupation?.preferences?.length > 0
                ) {
                    filter["educationDetails.occupation"] = {
                        $in: partnerPreference.educationDetails.occupation.preferences,
                    };
                }

                // --- Annual Income (partner preference fallback) ---
                // Stored as a single AnnualIncome _id ref, so match it directly —
                // no range resolution needed here.
                if (partnerPreference.educationDetails?.annualIncome) {
                    filter["educationDetails.annualIncome"] = partnerPreference.educationDetails.annualIncome;
                }

                if (partnerPreference.religionAndEthnicity?.religion?.preference) {
                    filter["religionDetails.religion"] = partnerPreference.religionAndEthnicity.religion.preference;
                }

                if (partnerPreference.religionAndEthnicity?.caste?.preferences?.length > 0) {
                    filter["religionDetails.caste"] = {
                        $in: partnerPreference.religionAndEthnicity.caste.preferences,
                    };
                }

                if (partnerPreference.religionAndEthnicity?.subCaste?.preferences?.length > 0) {
                    filter["religionDetails.subCaste"] = {
                        $in: partnerPreference.religionAndEthnicity.subCaste.preferences,
                    };
                }

                if (partnerPreference.religionAndEthnicity?.motherTongue?.preference) {
                    filter["religionDetails.motherTongue"] =
                        partnerPreference.religionAndEthnicity.motherTongue.preference;
                }

                if (hasActivePreference(partnerPreference.religionAndEthnicity?.manglikStatus?.preferences)) {
                    filter["religionDetails.manglik"] = {
                        $in: partnerPreference.religionAndEthnicity.manglikStatus.preferences,
                    };
                }

                if (hasActivePreference(partnerPreference.lifestyleAndAppearance?.dietaryHabits?.preferences)) {
                    filter["lifestyleDetails.eatingHabit"] = {
                        $in: partnerPreference.lifestyleAndAppearance.dietaryHabits.preferences,
                    };
                }

                if (hasActivePreference(partnerPreference.lifestyleAndAppearance?.smokingHabits?.preferences)) {
                    filter["additionalDetails.smoking"] = {
                        $in: partnerPreference.lifestyleAndAppearance.smokingHabits.preferences,
                    };
                }

                if (hasActivePreference(partnerPreference.lifestyleAndAppearance?.drinkingHabits?.preferences)) {
                    filter["additionalDetails.drinking"] = {
                        $in: partnerPreference.lifestyleAndAppearance.drinkingHabits.preferences,
                    };
                }

                if (hasActivePreference(partnerPreference.lifestyleAndAppearance?.disability?.preferences)) {
                    filter["additionalDetails.disability"] = {
                        $in: partnerPreference.lifestyleAndAppearance.disability.preferences,
                    };
                }

                if (partnerPreference.familyDetails?.familyBasedOutOfCountry?.country) {
                    filter["familyDetails.basedOutOfCountry"] =
                        partnerPreference.familyDetails.familyBasedOutOfCountry.country;
                }
            }
        }

        // 5. Fetch
        let profiles = await Profile.find(filter).populate({
            path: "subscription.packageId",
            select: "title displayOrder"
        });

        // Just Joined fallback
        if (matchPreferences.includes("justJoined") && profiles.length === 0) {
            delete filter.createdAt;

            profiles = await Profile.find(filter)
                .populate({
                    path: "subscription.packageId",
                    select: "title displayOrder"
                })
                .sort({ createdAt: -1 });
        }

        profiles.sort((a: any, b: any) => {
            // Active subscription check
            const aSubscribed =
                a.subscription?.isActive &&
                new Date(a.subscription.expiryDate) > new Date();

            const bSubscribed =
                b.subscription?.isActive &&
                new Date(b.subscription.expiryDate) > new Date();

            // Subscribed profiles first
            if (aSubscribed && !bSubscribed) {
                return -1;
            }

            if (!aSubscribed && bSubscribed) {
                return 1;
            }

            // Both subscribed:
            // sort by package priority
            if (aSubscribed && bSubscribed) {

                return (
                    a.subscription.packageId.displayOrder -
                    b.subscription.packageId.displayOrder
                );
            }

            return 0;
        });

        return res.status(200).json({
            success: true,
            total: profiles.length,
            data: profiles,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

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

export const getMyProfile = async (req: Request, res: Response) => {

    try {

        const { id } = req.user

        const profile = await Profile.findOne({
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

    catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProfile = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = updateProfileSchema.parse({
            body: req.body,
        });

        const updateData: Record<string, any> = {};

        (Object.keys(validatedData.body) as Array<keyof typeof validatedData.body>)
            .forEach((key) => {

                const value = validatedData.body[key];

                if (value !== undefined && value !== null) {
                    updateData[key] = value;
                }

            });

        // Photos
        if (req.files) {
            const files = req.files as Express.Multer.File[];

            if (files.length > 0) {
                updateData.photos = files.map((file) => file.path);
            }
        }

        const profile = await Profile.findOneAndUpdate(
            {
                userId: req.user.id,
                isDeleted: false,
            },
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            }
        );

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

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

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

export const uploadProfilePhotos = async (req: Request, res: Response) => {

    try {

        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image.",
            });
        }

        const imageUrls = files.map((file: any) => file.path);

        const profile = await Profile.findOneAndUpdate(
            {
                userId: req.user.id,
                isDeleted: false,
            },
            {
                $push: {
                    photos: {
                        $each: imageUrls,
                    },
                },
            },
            {
                new: true,
            }
        );

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

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// Normalizes query keys so "Gender", "MinAge", etc. are treated the same as "gender", "minAge"
const normalizeQueryKeys = (query: Record<string, any>) => {
    const normalized: Record<string, any> = {};

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

export const getProfileById = async (
    req: Request,
    res: Response
) => {

    try {

        const { id } = req.params;

        const profile = await Profile.findOne({
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

    } catch (error: any) {

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

};

export const deleteProfile = async (req: Request, res: Response) => {

    try {

        const profile = await Profile.findOneAndUpdate(

            {
                userId: req.user.id,
                isDeleted: false,
            },

            {
                isDeleted: true,
            },

            {
                new: true,
            }

        );

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

    catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }

};

export const getRecommendedMatches = async (
    req: Request,
    res: Response
) => {

    try {

        // Logged in user's profile
        const loggedInProfile = await Profile.findOne({
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
        const ignoredProfileIds = await Ignore.find({
            userId: loggedInProfile._id,
        }).distinct("ignoredUserId");

        // Blocked profiles
        const blockedProfileIds = await Block.find({
            userId: loggedInProfile._id,
        }).distinct("blockedUserId");

        // Profiles that blocked me
        const blockedMeProfileIds = await Block.find({
            blockedUserId: loggedInProfile._id,
        }).distinct("userId");

        // Already sent interest
        const interestedProfileIds = await Interest.find({
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
        const profiles = await Profile.find({
            _id: {
                $nin: uniqueExcludedIds,
            },
            isDeleted: false,
        });

        const recommendedProfiles = profiles.map((profile) => {

            let score = 0;

            // Religion
            if (
                profile.religionDetails?.religion ===
                loggedInProfile.religionDetails?.religion
            ) {
                score += 20;
            }

            // Mother Tongue
            if (
                profile.religionDetails?.motherTongue ===
                loggedInProfile.religionDetails?.motherTongue
            ) {
                score += 15;
            }

            // State
            if (
                profile.locationDetails?.state ===
                loggedInProfile.locationDetails?.state
            ) {
                score += 10;
            }

            // City
            if (
                profile.locationDetails?.city ===
                loggedInProfile.locationDetails?.city
            ) {
                score += 10;
            }

            // Highest Qualification
            if (
                profile.educationDetails?.highestQualification ===
                loggedInProfile.educationDetails?.highestQualification
            ) {
                score += 15;
            }

            // Occupation
            if (
                profile.careerDetails?.occupation ===
                loggedInProfile.careerDetails?.occupation
            ) {
                score += 10;
            }

            // Diet
            if (
                profile.lifestyle?.dietaryHabit ===
                loggedInProfile.lifestyle?.dietaryHabit
            ) {
                score += 5;
            }

            // Drinking
            if (
                profile.lifestyle?.drinkingHabit ===
                loggedInProfile.lifestyle?.drinkingHabit
            ) {
                score += 3;
            }

            // Smoking
            if (
                profile.lifestyle?.smokingHabit ===
                loggedInProfile.lifestyle?.smokingHabit
            ) {
                score += 3;
            }

            // Family Status
            if (
                profile.family?.familyStatus ===
                loggedInProfile.family?.familyStatus
            ) {
                score += 5;
            }

            // Rashi
            if (
                profile.horoscopeDetails?.starDetails?.rashi ===
                loggedInProfile.horoscopeDetails?.starDetails?.rashi
            ) {
                score += 8;
            }

            // Age Difference
            const ageDifference = Math.abs(
                profile.basicDetails.age -
                loggedInProfile.basicDetails.age
            );

            if (ageDifference <= 2) {
                score += 15;
            } else if (ageDifference <= 5) {
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

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};