"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAboutUsValidation = exports.createAboutUsValidation = void 0;
const zod_1 = require("zod");
const ceoSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).max(100),
    image: zod_1.z.string().trim().min(1),
    description: zod_1.z.string().trim().min(1).max(2000),
    designation: zod_1.z.string().trim().min(1).max(100),
});
const missionVisionSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).max(100),
    missionTitle: zod_1.z.string().trim().min(1).max(100),
    missionDescription: zod_1.z.string().trim().min(1).max(1000),
    visionTitle: zod_1.z.string().trim().min(1).max(100),
    visionDescription: zod_1.z.string().trim().min(1).max(1000),
});
const aboutSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).max(100),
    image: zod_1.z.string().trim().min(1),
    description: zod_1.z.string().trim().min(1).max(2000),
    verifiedProfiles: zod_1.z.number().min(0),
    successfulMatches: zod_1.z.number().min(0),
    citiesCovered: zod_1.z.number().min(0),
    yearsOfTrust: zod_1.z.number().min(0),
});
const awardSchema = zod_1.z.object({
    image: zod_1.z.string().trim().min(1),
    title: zod_1.z.string().trim().min(1).max(150),
    subtitle: zod_1.z.string().trim().min(1).max(150),
});
const awardWinnerSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).max(100),
    awards: zod_1.z.array(awardSchema),
});
const howToUseStepSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(150),
    description: zod_1.z.string().trim().min(1).max(500),
});
const howToUseSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).max(100),
    steps: zod_1.z.array(howToUseStepSchema),
});
const moneyBackGuaranteeSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).max(100),
    description: zod_1.z.string().trim().min(1).max(1000),
    note: zod_1.z.string().trim().min(1).max(300),
});
const securityFeatureSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(150),
    description: zod_1.z.string().trim().min(1).max(500),
});
const secureSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).max(100),
    features: zod_1.z.array(securityFeatureSchema),
});
exports.createAboutUsValidation = zod_1.z.object({
    ceoSection: ceoSectionSchema,
    missionVisionSection: missionVisionSectionSchema,
    aboutSection: aboutSectionSchema,
    awardWinnerSection: awardWinnerSectionSchema,
    howToUseSection: howToUseSectionSchema,
    moneyBackGuaranteeSection: moneyBackGuaranteeSectionSchema,
    secureSection: secureSectionSchema,
});
exports.updateAboutUsValidation = exports.createAboutUsValidation.partial();
