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
exports.resetPartnerPreferenceSection = exports.getPartnerPreference = exports.savePartnerPreference = void 0;
const partnerPreference_model_1 = require("./partnerPreference.model");
const profile_model_1 = require("../profile.model");
const partnerPreference_validation_1 = require("./partnerPreference.validation");
// Common population chain used by both save and fetch
const populatePartnerPreference = (query) => query
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
const flattenForMongoSet = (obj, parentKey = "") => {
    const result = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        const path = parentKey ? `${parentKey}.${key}` : key;
        if (value === undefined) {
            continue;
        }
        const isPlainObject = value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            !(value instanceof Date);
        if (isPlainObject) {
            Object.assign(result, flattenForMongoSet(value, path));
        }
        else {
            result[path] = value;
        }
    }
    return result;
};
const savePartnerPreference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const validatedData = partnerPreference_validation_1.createPartnerPreferenceSchema.parse(req);
        // Find logged-in user's profile
        const profile = yield profile_model_1.Profile.findOne({
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
        const partnerPreference = yield partnerPreference_model_1.PartnerPreference.findOneAndUpdate({ profileId: profile._id }, {
            $set: flattenedUpdate,
            $setOnInsert: {
                profileId: profile._id,
            },
        }, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        const populatedPartnerPreference = yield populatePartnerPreference(partnerPreference_model_1.PartnerPreference.findById(partnerPreference._id));
        res.status(200).json({
            success: true,
            message: "Partner preferences saved successfully.",
            data: populatedPartnerPreference,
        });
    }
    catch (error) {
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
});
exports.savePartnerPreference = savePartnerPreference;
const getPartnerPreference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find logged-in user's profile
        const profile = yield profile_model_1.Profile.findOne({
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
        const partnerPreference = yield partnerPreference_model_1.PartnerPreference.findOne({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});
exports.getPartnerPreference = getPartnerPreference;
// Reset values for each section
const resetSectionValues = {
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
const resetPartnerPreferenceSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const profile = yield profile_model_1.Profile.findOne({
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
        const partnerPreference = yield partnerPreference_model_1.PartnerPreference.findOne({
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
        const updatedPartnerPreference = yield partnerPreference_model_1.PartnerPreference.findOneAndUpdate({
            profileId: profile._id,
            isDeleted: false,
        }, {
            $set: resetValues,
        }, {
            new: true,
            runValidators: true,
        });
        if (!updatedPartnerPreference) {
            res.status(404).json({
                success: false,
                message: "Partner preferences not found.",
            });
            return;
        }
        // Populate response
        const populatedPartnerPreference = yield populatePartnerPreference(partnerPreference_model_1.PartnerPreference.findById(updatedPartnerPreference._id));
        const formattedSection = section
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (char) => char.toUpperCase());
        res.status(200).json({
            success: true,
            message: `${formattedSection} reset successfully.`,
            data: populatedPartnerPreference,
        });
    }
    catch (error) {
        console.error("Reset Partner Preference Section Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});
exports.resetPartnerPreferenceSection = resetPartnerPreferenceSection;
