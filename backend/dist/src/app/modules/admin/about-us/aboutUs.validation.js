"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAboutUsValidation = exports.createAboutUsValidation = void 0;
const zod_1 = require("zod");
// ==========================================
// CEO SECTION
// ==========================================
const ceoSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).optional(),
    image: zod_1.z.string().trim().min(1).optional(),
    description: zod_1.z.string().trim().min(1).optional(),
    designation: zod_1.z.string().trim().min(1).optional(),
});
// ==========================================
// MISSION & VISION SECTION
// ==========================================
const missionVisionSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).optional(),
    missionTitle: zod_1.z.string().trim().min(1).optional(),
    missionDescription: zod_1.z.string().trim().min(1).optional(),
    visionTitle: zod_1.z.string().trim().min(1).optional(),
    visionDescription: zod_1.z.string().trim().min(1).optional(),
});
// ==========================================
// ABOUT SECTION
// ==========================================
const aboutSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).optional(),
    image: zod_1.z.string().trim().min(1).optional(),
    description: zod_1.z.string().trim().min(1).optional(),
    verifiedProfiles: zod_1.z.number().min(0).optional(),
    successfulMatches: zod_1.z.number().min(0).optional(),
    citiesCovered: zod_1.z.number().min(0).optional(),
    yearsOfTrust: zod_1.z.number().min(0).optional(),
});
// ==========================================
// AWARD
// ==========================================
const awardSchema = zod_1.z.object({
    image: zod_1.z.string().trim().min(1).optional(),
    title: zod_1.z.string().trim().min(1).optional(),
    subtitle: zod_1.z.string().trim().min(1).optional(),
});
// ==========================================
// AWARD WINNER SECTION
// ==========================================
const awardWinnerSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).optional(),
    awards: zod_1.z.array(awardSchema).optional(),
});
// ==========================================
// HOW TO USE STEP
// ==========================================
const howToUseStepSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).optional(),
    description: zod_1.z.string().trim().min(1).optional(),
});
// ==========================================
// HOW TO USE SECTION
// ==========================================
const howToUseSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).optional(),
    steps: zod_1.z.array(howToUseStepSchema).optional(),
});
// ==========================================
// MONEY BACK GUARANTEE SECTION
// ==========================================
const moneyBackGuaranteeSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).optional(),
    description: zod_1.z.string().trim().min(1).optional(),
    note: zod_1.z.string().trim().min(1).optional(),
});
// ==========================================
// SECURITY FEATURE
// ==========================================
const securityFeatureSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).optional(),
    description: zod_1.z.string().trim().min(1).optional(),
});
// ==========================================
// SECURE SECTION
// ==========================================
const secureSectionSchema = zod_1.z.object({
    heading: zod_1.z.string().trim().min(1).optional(),
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
