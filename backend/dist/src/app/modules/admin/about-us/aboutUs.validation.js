"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAboutUsValidation = exports.createAboutUsValidation = void 0;
const zod_1 = require("zod");
// ==========================================
// CEO SECTION
// ==========================================
const ceoSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().optional(),
    image: zod_1.z.string().trim().optional(),
    description: zod_1.z.string().trim().optional(),
    designation: zod_1.z.string().trim().optional(),
});
// ==========================================
// MISSION & VISION SECTION
// ==========================================
const missionVisionSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().optional(),
    missionTitle: zod_1.z.string().trim().optional(),
    missionDescription: zod_1.z.string().trim().optional(),
    visionTitle: zod_1.z.string().trim().optional(),
    visionDescription: zod_1.z.string().trim().optional(),
});
// ==========================================
// ABOUT SECTION
// ==========================================
const aboutSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().optional(),
    image: zod_1.z.string().trim().optional(),
    description: zod_1.z.string().trim().optional(),
    verifiedProfiles: zod_1.z.number().optional(),
    successfulMatches: zod_1.z.number().optional(),
    citiesCovered: zod_1.z.number().optional(),
    yearsOfTrust: zod_1.z.number().optional(),
});
// ==========================================
// AWARD
// ==========================================
const awardSchema = zod_1.z.object({
    image: zod_1.z.string().trim().optional(),
    title: zod_1.z.string().trim().optional(),
    subtitle: zod_1.z.string().trim().optional(),
});
// ==========================================
// AWARD WINNER SECTION
// ==========================================
const awardWinnerSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().optional(),
    awards: zod_1.z.array(awardSchema).optional(),
});
// ==========================================
// HOW TO USE STEP
// ==========================================
const howToUseStepSchema = zod_1.z.object({
    title: zod_1.z.string().trim().optional(),
    description: zod_1.z.string().trim().optional(),
});
// ==========================================
// HOW TO USE SECTION
// ==========================================
const howToUseSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().optional(),
    steps: zod_1.z.array(howToUseStepSchema).optional(),
});
// ==========================================
// MONEY BACK GUARANTEE SECTION
// ==========================================
const moneyBackGuaranteeSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().optional(),
    description: zod_1.z.string().trim().optional(),
    note: zod_1.z.string().trim().optional(),
});
// ==========================================
// SECURITY FEATURE
// ==========================================
const securityFeatureSchema = zod_1.z.object({
    title: zod_1.z.string().trim().optional(),
    description: zod_1.z.string().trim().optional(),
});
// ==========================================
// SECURE SECTION
// ==========================================
const secureSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().optional(),
    features: zod_1.z.array(securityFeatureSchema).optional(),
});
// ==========================================
// CREATE
// ==========================================
exports.createAboutUsValidation = zod_1.z.object({
    ceoSection: ceoSectionSchema.optional(),
    missionVisionSection: missionVisionSectionSchema.optional(),
    aboutSection: aboutSectionSchema.optional(),
    awardWinnerSection: awardWinnerSectionSchema.optional(),
    howToUseSection: howToUseSectionSchema.optional(),
    moneyBackGuaranteeSection: moneyBackGuaranteeSectionSchema.optional(),
    secureSection: secureSectionSchema.optional(),
});
// ==========================================
// UPDATE
// ==========================================
exports.updateAboutUsValidation = exports.createAboutUsValidation;
