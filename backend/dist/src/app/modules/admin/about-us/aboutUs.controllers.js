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
exports.getAboutUs = exports.createOrUpdateAboutUs = void 0;
const aboutUs_model_1 = require("./aboutUs.model");
const aboutUs_validation_1 = require("./aboutUs.validation");
const createOrUpdateAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const files = req.files;
        const aboutUsData = {};
        // ==========================================
        // CEO SECTION
        // ==========================================
        const ceoSection = {};
        if (req.body.ceoHeading !== undefined) {
            ceoSection.heading = req.body.ceoHeading;
        }
        if (req.body.ceoDescription !== undefined) {
            ceoSection.description = req.body.ceoDescription;
        }
        if (req.body.ceoDesignation !== undefined) {
            ceoSection.designation = req.body.ceoDesignation;
        }
        if ((_a = files === null || files === void 0 ? void 0 : files.ceoImage) === null || _a === void 0 ? void 0 : _a.length) {
            ceoSection.image = files.ceoImage[0].path;
        }
        if (Object.keys(ceoSection).length > 0) {
            aboutUsData.ceoSection = ceoSection;
        }
        // ==========================================
        // MISSION & VISION SECTION
        // ==========================================
        const missionVisionSection = {};
        if (req.body.missionVisionHeading !== undefined) {
            missionVisionSection.heading = req.body.missionVisionHeading;
        }
        if (req.body.missionTitle !== undefined) {
            missionVisionSection.missionTitle = req.body.missionTitle;
        }
        if (req.body.missionDescription !== undefined) {
            missionVisionSection.missionDescription =
                req.body.missionDescription;
        }
        if (req.body.visionTitle !== undefined) {
            missionVisionSection.visionTitle = req.body.visionTitle;
        }
        if (req.body.visionDescription !== undefined) {
            missionVisionSection.visionDescription =
                req.body.visionDescription;
        }
        if (Object.keys(missionVisionSection).length > 0) {
            aboutUsData.missionVisionSection = missionVisionSection;
        }
        // ==========================================
        // ABOUT SECTION
        // ==========================================
        const aboutSection = {};
        if (req.body.aboutHeading !== undefined) {
            aboutSection.heading = req.body.aboutHeading;
        }
        if (req.body.aboutDescription !== undefined) {
            aboutSection.description = req.body.aboutDescription;
        }
        if (req.body.verifiedProfiles !== undefined) {
            aboutSection.verifiedProfiles = Number(req.body.verifiedProfiles);
        }
        if (req.body.successfulMatches !== undefined) {
            aboutSection.successfulMatches = Number(req.body.successfulMatches);
        }
        if (req.body.citiesCovered !== undefined) {
            aboutSection.citiesCovered = Number(req.body.citiesCovered);
        }
        if (req.body.yearsOfTrust !== undefined) {
            aboutSection.yearsOfTrust = Number(req.body.yearsOfTrust);
        }
        if ((_b = files === null || files === void 0 ? void 0 : files.aboutImage) === null || _b === void 0 ? void 0 : _b.length) {
            aboutSection.image = files.aboutImage[0].path;
        }
        if (Object.keys(aboutSection).length > 0) {
            aboutUsData.aboutSection = aboutSection;
        }
        // ==========================================
        // AWARD WINNER SECTION
        // ==========================================
        const awardWinnerSection = {};
        if (req.body.awardWinnerHeading !== undefined) {
            awardWinnerSection.heading = req.body.awardWinnerHeading;
        }
        const awardTitles = req.body.awardTitle
            ? Array.isArray(req.body.awardTitle)
                ? req.body.awardTitle
                : [req.body.awardTitle]
            : [];
        const awardSubtitles = req.body.awardSubtitle
            ? Array.isArray(req.body.awardSubtitle)
                ? req.body.awardSubtitle
                : [req.body.awardSubtitle]
            : [];
        const awardImages = (files === null || files === void 0 ? void 0 : files.awardImages) || [];
        const awards = [];
        const awardCount = Math.max(awardTitles.length, awardSubtitles.length, awardImages.length);
        for (let i = 0; i < awardCount; i++) {
            const award = {};
            if (awardTitles[i] !== undefined) {
                award.title = awardTitles[i];
            }
            if (awardSubtitles[i] !== undefined) {
                award.subtitle = awardSubtitles[i];
            }
            if (awardImages[i]) {
                award.image = awardImages[i].path;
            }
            if (Object.keys(award).length > 0) {
                awards.push(award);
            }
        }
        if (awards.length > 0) {
            awardWinnerSection.awards = awards;
        }
        if (Object.keys(awardWinnerSection).length > 0) {
            aboutUsData.awardWinnerSection = awardWinnerSection;
        }
        // ==========================================
        // HOW TO USE SECTION
        // ==========================================
        const howToUseSection = {};
        if (req.body.howToUseHeading !== undefined) {
            howToUseSection.heading = req.body.howToUseHeading;
        }
        const stepTitles = req.body.stepTitle
            ? Array.isArray(req.body.stepTitle)
                ? req.body.stepTitle
                : [req.body.stepTitle]
            : [];
        const stepDescriptions = req.body.stepDescription
            ? Array.isArray(req.body.stepDescription)
                ? req.body.stepDescription
                : [req.body.stepDescription]
            : [];
        const steps = [];
        const stepCount = Math.max(stepTitles.length, stepDescriptions.length);
        for (let i = 0; i < stepCount; i++) {
            const step = {};
            if (stepTitles[i] !== undefined) {
                step.title = stepTitles[i];
            }
            if (stepDescriptions[i] !== undefined) {
                step.description = stepDescriptions[i];
            }
            if (Object.keys(step).length > 0) {
                steps.push(step);
            }
        }
        if (steps.length > 0) {
            howToUseSection.steps = steps;
        }
        if (Object.keys(howToUseSection).length > 0) {
            aboutUsData.howToUseSection = howToUseSection;
        }
        // ==========================================
        // MONEY BACK GUARANTEE SECTION
        // ==========================================
        const moneyBackGuaranteeSection = {};
        if (req.body.moneyBackHeading !== undefined) {
            moneyBackGuaranteeSection.heading =
                req.body.moneyBackHeading;
        }
        if (req.body.moneyBackDescription !== undefined) {
            moneyBackGuaranteeSection.description =
                req.body.moneyBackDescription;
        }
        if (req.body.moneyBackNote !== undefined) {
            moneyBackGuaranteeSection.note =
                req.body.moneyBackNote;
        }
        if (Object.keys(moneyBackGuaranteeSection).length > 0) {
            aboutUsData.moneyBackGuaranteeSection =
                moneyBackGuaranteeSection;
        }
        // ==========================================
        // SECURE SECTION
        // ==========================================
        const secureSection = {};
        if (req.body.secureHeading !== undefined) {
            secureSection.heading = req.body.secureHeading;
        }
        const securityTitles = req.body.securityTitle
            ? Array.isArray(req.body.securityTitle)
                ? req.body.securityTitle
                : [req.body.securityTitle]
            : [];
        const securityDescriptions = req.body.securityDescription
            ? Array.isArray(req.body.securityDescription)
                ? req.body.securityDescription
                : [req.body.securityDescription]
            : [];
        const features = [];
        const featureCount = Math.max(securityTitles.length, securityDescriptions.length);
        for (let i = 0; i < featureCount; i++) {
            const feature = {};
            if (securityTitles[i] !== undefined) {
                feature.title = securityTitles[i];
            }
            if (securityDescriptions[i] !== undefined) {
                feature.description = securityDescriptions[i];
            }
            if (Object.keys(feature).length > 0) {
                features.push(feature);
            }
        }
        if (features.length > 0) {
            secureSection.features = features;
        }
        if (Object.keys(secureSection).length > 0) {
            aboutUsData.secureSection = secureSection;
        }
        // ==========================================
        // VALIDATION
        // ==========================================
        const validatedData = aboutUs_validation_1.createAboutUsValidation.parse(aboutUsData);
        // ==========================================
        // CREATE / UPDATE
        // ==========================================
        const aboutUs = yield aboutUs_model_1.AboutUs.findOneAndUpdate({ isDeleted: false }, { $set: validatedData }, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        res.status(200).json({
            success: true,
            message: "About Us saved successfully.",
            data: aboutUs,
        });
    }
    catch (error) {
        console.error("About Us Error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createOrUpdateAboutUs = createOrUpdateAboutUs;
const getAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const aboutUs = yield aboutUs_model_1.AboutUs.findOne({
            isDeleted: false,
        });
        res.status(200).json({
            success: true,
            data: aboutUs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getAboutUs = getAboutUs;
