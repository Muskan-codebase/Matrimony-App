import { z } from "zod";

// ==========================================
// CEO SECTION
// ==========================================

const ceoSectionSchema = z.object({
    heading: z.string().trim().optional(),
    image: z.string().trim().optional(),
    description: z.string().trim().optional(),
    designation: z.string().trim().optional(),
});

// ==========================================
// MISSION & VISION SECTION
// ==========================================

const missionVisionSectionSchema = z.object({
    heading: z.string().trim().optional(),

    missionTitle: z.string().trim().optional(),
    missionDescription: z.string().trim().optional(),

    visionTitle: z.string().trim().optional(),
    visionDescription: z.string().trim().optional(),
});

// ==========================================
// ABOUT SECTION
// ==========================================

const aboutSectionSchema = z.object({
    heading: z.string().trim().optional(),
    image: z.string().trim().optional(),
    description: z.string().trim().optional(),

    verifiedProfiles: z.number().optional(),
    successfulMatches: z.number().optional(),
    citiesCovered: z.number().optional(),
    yearsOfTrust: z.number().optional(),
});

// ==========================================
// AWARD
// ==========================================

const awardSchema = z.object({
    image: z.string().trim().optional(),
    title: z.string().trim().optional(),
    subtitle: z.string().trim().optional(),
});

// ==========================================
// AWARD WINNER SECTION
// ==========================================

const awardWinnerSectionSchema = z.object({
    heading: z.string().trim().optional(),
    awards: z.array(awardSchema).optional(),
});

// ==========================================
// HOW TO USE STEP
// ==========================================

const howToUseStepSchema = z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
});

// ==========================================
// HOW TO USE SECTION
// ==========================================

const howToUseSectionSchema = z.object({
    heading: z.string().trim().optional(),
    steps: z.array(howToUseStepSchema).optional(),
});

// ==========================================
// MONEY BACK GUARANTEE SECTION
// ==========================================

const moneyBackGuaranteeSectionSchema = z.object({
    heading: z.string().trim().optional(),
    description: z.string().trim().optional(),
    note: z.string().trim().optional(),
});

// ==========================================
// SECURITY FEATURE
// ==========================================

const securityFeatureSchema = z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
});

// ==========================================
// SECURE SECTION
// ==========================================

const secureSectionSchema = z.object({
    heading: z.string().trim().optional(),
    features: z.array(securityFeatureSchema).optional(),
});

// ==========================================
// CREATE
// ==========================================

export const createAboutUsValidation = z.object({
    ceoSection: ceoSectionSchema.optional(),

    missionVisionSection: missionVisionSectionSchema.optional(),

    aboutSection: aboutSectionSchema.optional(),

    awardWinnerSection: awardWinnerSectionSchema.optional(),

    howToUseSection: howToUseSectionSchema.optional(),

    moneyBackGuaranteeSection:
        moneyBackGuaranteeSectionSchema.optional(),

    secureSection: secureSectionSchema.optional(),
});

// ==========================================
// UPDATE
// ==========================================

export const updateAboutUsValidation =
    createAboutUsValidation;