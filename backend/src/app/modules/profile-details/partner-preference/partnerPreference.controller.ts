import { Request, Response } from "express";
import { PartnerPreference } from "./partnerPreference.model";
import { Profile } from "../profile.model";
import { createPartnerPreferenceSchema } from "./partnerPreference.validation";

// Common population chain used by both save and fetch
const populatePartnerPreference = (query: any) =>
    query
        .populate("profileId")
        .populate("basicDetails.height.minHeight")
        .populate("basicDetails.height.maxHeight")
        .populate({
            path: "educationDetails.highestDegrees",
            select: "qualification",
        })
        .populate({
            path: "educationDetails.occupation.preferences",
            select: "occupation",
        })
        .populate("educationDetails.annualIncome")
        .populate("religionAndEthnicity.religion.preference")
        .populate("religionAndEthnicity.caste.preferences")
        .populate("religionAndEthnicity.subCaste.preferences")
        .populate("religionAndEthnicity.motherTongue.preference");

const flattenForMongoSet = (
    obj: Record<string, any>,
    parentKey = ""
): Record<string, any> => {
    const result: Record<string, any> = {};

    for (const key of Object.keys(obj)) {
        const value = obj[key];
        const path = parentKey ? `${parentKey}.${key}` : key;

        if (value === undefined) {
            continue;
        }

        const isPlainObject =
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            !(value instanceof Date);

        if (isPlainObject) {
            Object.assign(result, flattenForMongoSet(value, path));
        } else {
            result[path] = value;
        }
    }

    return result;
};

export const savePartnerPreference = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        // Validate request body
        const validatedData = createPartnerPreferenceSchema.parse(req);

        // Find logged-in user's profile
        const profile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!profile) {
            res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
            return;
        }

        // Flatten into dot-notation so a partial payload (e.g. only
        // basicDetails.age) only touches that specific field, instead of
        // overwriting the whole basicDetails subdocument.
        const flattenedUpdate = flattenForMongoSet(validatedData.body);
        flattenedUpdate["isDeleted"] = false;

        // Upsert: creates the document on first save, updates it on every
        // subsequent save. Since profileId is unique, this naturally acts
        // as one endpoint for both "create" and "edit" flows — the caller
        // never needs to know whether preferences already exist.
        const partnerPreference = await PartnerPreference.findOneAndUpdate(
            { profileId: profile._id },
            {
                $set: flattenedUpdate,
                $setOnInsert: {
                    profileId: profile._id,
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        const populatedPartnerPreference = await populatePartnerPreference(
            PartnerPreference.findById(partnerPreference._id)
        );

        res.status(200).json({
            success: true,
            message: "Partner preferences saved successfully.",
            data: populatedPartnerPreference,
        });

    } catch (error: any) {
        console.error("Save Partner Preference Error:", error);

        if (error.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: error.errors,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const getPartnerPreference = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        // Find logged-in user's profile
        const profile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!profile) {
            res.status(404).json({
                success: false,
                message: "Profile not found.",
            });

            return;
        }

        // Find partner preference
        const partnerPreference = await PartnerPreference.findOne({
            profileId: profile._id,
            isDeleted: false,
        })
            .populate("profileId")
            .populate("basicDetails.height.minHeight")
            .populate("basicDetails.height.maxHeight")
            .populate({
                path: "educationDetails.highestDegrees",
                select: "qualification"
            })
            .populate({
                path: "educationDetails.occupation.preferences",
                select: "occupation",
            })
            .populate("educationDetails.annualIncome")
            .populate("religionAndEthnicity.religion.preference")
            .populate("religionAndEthnicity.caste.preferences")
            .populate("religionAndEthnicity.motherTongue.preference");

        if (!partnerPreference) {
            res.status(404).json({
                success: false,
                message: "Partner preferences not found.",
            });

            return;
        }

        res.status(200).json({
            success: true,
            message: "Partner preferences fetched successfully.",
            data: partnerPreference,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

// Reset values for each section
const resetSectionValues: Record<string, Record<string, any>> = {

    basicDetails: {
        "basicDetails.age.minAge": null,
        "basicDetails.age.maxAge": null,
        "basicDetails.height.minHeight": null,
        "basicDetails.height.maxHeight": null,
        "basicDetails.partnerCountry": [],
        "basicDetails.partnerState": [],
        "basicDetails.partnerCity": [],
        "basicDetails.maritalStatus.preferences": [],
    },

    educationDetails: {
        "educationDetails.doesntMatter": false,
        "educationDetails.highestDegrees": [],
        "educationDetails.wellKnownColleges": "",
        "educationDetails.occupation.doesntMatter": false,
        "educationDetails.occupation.preferences": [],
        "educationDetails.annualIncome": null,
    },

    familyDetails: {
        "familyDetails.familyBasedOutOfCountry.country": "",
    },

    religionAndEthnicity: {
        "religionAndEthnicity.religion.preference": null,
        "religionAndEthnicity.caste.preferences": [],
        "religionAndEthnicity.subCaste.preferences": [],
        "religionAndEthnicity.motherTongue.preference": null,
        "religionAndEthnicity.manglikStatus.preferences": [],
    },

    lifestyleAndAppearance: {
        "lifestyleAndAppearance.dietaryHabits.preferences": [],
        "lifestyleAndAppearance.smokingHabits.preferences": [],
        "lifestyleAndAppearance.drinkingHabits.preferences": [],
        "lifestyleAndAppearance.disability.preferences": [],
    },

    aboutMyPartner: {
        "aboutMyPartner.description": "",
    },
};

export const resetPartnerPreferenceSection = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const { section } = req.params;

        // Basic details should NEVER be reset
        const allowedSections = Object.keys(resetSectionValues);

        if (!allowedSections.includes(section)) {
            res.status(400).json({
                success: false,
                message: "Invalid or non-resettable section.",
            });

            return;
        }

        // Find logged-in user's profile
        const profile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!profile) {
            res.status(404).json({
                success: false,
                message: "Profile not found.",
            });

            return;
        }

        // Find partner preference
        const partnerPreference = await PartnerPreference.findOne({
            profileId: profile._id,
            isDeleted: false,
        });

        if (!partnerPreference) {
            res.status(404).json({
                success: false,
                message: "Partner preferences not found.",
            });

            return;
        }

        // Get reset values for requested section
        const resetValues = resetSectionValues[section];

        // Reset only that section
        const updatedPartnerPreference =
            await PartnerPreference.findOneAndUpdate(
                {
                    profileId: profile._id,
                    isDeleted: false,
                },
                {
                    $set: resetValues,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedPartnerPreference) {
            res.status(404).json({
                success: false,
                message: "Partner preferences not found.",
            });

            return;
        }

        // Populate response
        const populatedPartnerPreference =
            await populatePartnerPreference(
                PartnerPreference.findById(updatedPartnerPreference._id)
            );

        const formattedSection = section
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (char) => char.toUpperCase());

        res.status(200).json({
            success: true,
            message: `${formattedSection} reset successfully.`,
            data: populatedPartnerPreference,
        });

    } catch (error: any) {

        console.error(
            "Reset Partner Preference Section Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};