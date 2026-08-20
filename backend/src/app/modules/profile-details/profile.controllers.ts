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
import { getRecommended } from "../../services/recommendation.service";
import { AccountSettings } from "../account-settings/accountSettings.model";
import { sendNotification } from "../../services/sendNotification.service";
// import { generateMatrimonyId } from "../../utils/counter/counter.service";

export const generateMatrimonyId = (
    firstName: string,
    lastName: string,
    dob: Date
): string => {
    const firstInitial = firstName.trim().charAt(0).toUpperCase();
    const lastInitial = lastName.trim().charAt(0).toUpperCase();

    const date = new Date(dob);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${firstInitial}${lastInitial}${day}${month}${year}`;
};

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

        // Get basic details from validated data
        const { basicDetails } = validatedData.body;

        // Generate matrimony ID
        const matrimonyId = generateMatrimonyId(
            basicDetails?.firstName,
            basicDetails?.lastName,
            basicDetails?.dob
        );

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
            // Only verified profiles
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

        // Match Preference → City / State
        const locationPreference = matchPreferences.filter(
            (preference: string) =>
                preference !== "verified" &&
                preference !== "justJoined"
        );

        if (locationPreference.length > 0) {
            filter.$or = [
                {
                    "locationDetails.city": {
                        $in: locationPreference,
                    },
                },
                {
                    "locationDetails.state": {
                        $in: locationPreference,
                    },
                },
            ];

            hasExplicitFilters = true;
        }

        // 4. No explicit filters at all → fall back to saved partner preferences
        //    so the default feed is still personalised, not just "everyone".
        if (!hasExplicitFilters) {
            const partnerPreference = await PartnerPreference.findOne({
                profileId: loggedInProfile._id,
                isDeleted: false,
            });

            console.log("PARTNER PREF ID:", partnerPreference?._id);
            console.log("PARTNER PREF PROFILE ID:", partnerPreference?.profileId);
            console.log(
                "PARTNER PREF RAW:",
                JSON.stringify(partnerPreference?.toObject(), null, 2)
            );

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
        // let profiles = await Profile.find(filter)
        console.log("========== DEBUG ==========");

        // console.log(
        //     "Partner Preference Country:",
        //     partnerPreference?.basicDetails?.partnerCountry
        // );

        console.log(
            "FINAL FILTER:",
            JSON.stringify(filter, null, 2)
        );

        const indiaProfiles = await Profile.find({
            isDeleted: false,
            "locationDetails.country": "India",
        }).select("_id basicDetails.age locationDetails.country");

        console.log("India profiles:", indiaProfiles.length);
        console.log("India profiles data:", indiaProfiles);

        const indiaAgeProfiles = await Profile.find({
            isDeleted: false,
            "locationDetails.country": "India",
            "basicDetails.age": {
                $gte: 19,
                $lte: 40,
            },
        }).select("_id basicDetails.age locationDetails.country");

        console.log("India + Age 19-40:", indiaAgeProfiles.length);

        const indiaAgeExcludedProfiles = await Profile.find({
            isDeleted: false,
            "locationDetails.country": "India",
            "basicDetails.age": {
                $gte: 19,
                $lte: 40,
            },
            _id: {
                $nin: uniqueExcludedIds,
            },
        }).select("_id basicDetails.age locationDetails.country");

        console.log(
            "India + Age + Exclusions:",
            indiaAgeExcludedProfiles.length
        );

        console.log("===========================");

        let profiles = await Profile.find(filter);

        // Just Joined fallback
        if (matchPreferences.includes("justJoined") && profiles.length === 0) {
            delete filter.createdAt;

            profiles = await Profile.find(filter)
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

        // Get sender profile
        const senderProfile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!senderProfile) {
            return res.status(404).json({
                success: false,
                message: "Sender profile not found.",
            });
        }

        const recommendedProfiles = await getRecommended(loggedInProfile._id.toString());

        // Check notification settings
        const accountSettings = await AccountSettings.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        // Send push notification only if daily recommendations are enabled
        if (
            recommendedProfiles.length > 0 &&
            accountSettings?.notificationSettings?.appNotifications
                ?.dailyRecommendations === true
        ) {
            await sendNotification({
                receiverId: loggedInProfile.userId.toString(),
                title: "New Recommended Profiles",
                body: `We found ${recommendedProfiles.length} profiles that may be a good match for you.`,
                data: {
                    type: "recommended_profiles",
                },
            });
        }

        return res.status(200).json({
            success: true,
            count: recommendedProfiles.length,
            data: recommendedProfiles,
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};