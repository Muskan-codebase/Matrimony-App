import { z } from "zod";

const ceoSectionSchema = z.object({
    heading: z.string().trim().min(1).max(100),
    image: z.string().trim().min(1),
    description: z.string().trim().min(1).max(2000),
    designation: z.string().trim().min(1).max(100),
});

const missionVisionSectionSchema = z.object({
    heading: z.string().trim().min(1).max(100),

    missionTitle: z.string().trim().min(1).max(100),
    missionDescription: z.string().trim().min(1).max(1000),

    visionTitle: z.string().trim().min(1).max(100),
    visionDescription: z.string().trim().min(1).max(1000),
});

const aboutSectionSchema = z.object({
    heading: z.string().trim().min(1).max(100),
    image: z.string().trim().min(1),
    description: z.string().trim().min(1).max(2000),

    verifiedProfiles: z.number().min(0),
    successfulMatches: z.number().min(0),
    citiesCovered: z.number().min(0),
    yearsOfTrust: z.number().min(0),
});

const awardSchema = z.object({
    image: z.string().trim().min(1),
    title: z.string().trim().min(1).max(150),
    subtitle: z.string().trim().min(1).max(150),
});

const awardWinnerSectionSchema = z.object({
    heading: z.string().trim().min(1).max(100),
    awards: z.array(awardSchema),
});

const howToUseStepSchema = z.object({
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(500),
});

const howToUseSectionSchema = z.object({
    heading: z.string().trim().min(1).max(100),
    steps: z.array(howToUseStepSchema),
});

const moneyBackGuaranteeSectionSchema = z.object({
    heading: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(1000),
    note: z.string().trim().min(1).max(300),
});

const securityFeatureSchema = z.object({
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(500),
});

const secureSectionSchema = z.object({
    heading: z.string().trim().min(1).max(100),
    features: z.array(securityFeatureSchema),
});

export const createAboutUsValidation = z.object({
    ceoSection: ceoSectionSchema,

    missionVisionSection: missionVisionSectionSchema,

    aboutSection: aboutSectionSchema,

    awardWinnerSection: awardWinnerSectionSchema,

    howToUseSection: howToUseSectionSchema,

    moneyBackGuaranteeSection: moneyBackGuaranteeSectionSchema,

    secureSection: secureSectionSchema,
});

export const updateAboutUsValidation =
    createAboutUsValidation.partial();