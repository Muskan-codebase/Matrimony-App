import { Request, Response } from "express";
import { AboutUs } from "./aboutUs.model";
import { createAboutUsValidation } from "./aboutUs.validation";

export const createOrUpdateAboutUs = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const aboutUsData: any = {};

        // ==========================================
        // CEO SECTION
        // ==========================================

        const ceoSection: any = {};

        if (req.body.ceoHeading !== undefined) {
            ceoSection.heading = req.body.ceoHeading;
        }

        if (req.body.ceoDescription !== undefined) {
            ceoSection.description = req.body.ceoDescription;
        }

        if (req.body.ceoDesignation !== undefined) {
            ceoSection.designation = req.body.ceoDesignation;
        }

        if (files?.ceoImage?.length) {
            ceoSection.image = files.ceoImage[0].path;
        }

        if (Object.keys(ceoSection).length > 0) {
            aboutUsData.ceoSection = ceoSection;
        }

        // ==========================================
        // MISSION & VISION SECTION
        // ==========================================

        const missionVisionSection: any = {};

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

        const aboutSection: any = {};

        if (req.body.aboutHeading !== undefined) {
            aboutSection.heading = req.body.aboutHeading;
        }

        if (req.body.aboutDescription !== undefined) {
            aboutSection.description = req.body.aboutDescription;
        }

        if (req.body.verifiedProfiles !== undefined) {
            aboutSection.verifiedProfiles = Number(
                req.body.verifiedProfiles
            );
        }

        if (req.body.successfulMatches !== undefined) {
            aboutSection.successfulMatches = Number(
                req.body.successfulMatches
            );
        }

        if (req.body.citiesCovered !== undefined) {
            aboutSection.citiesCovered = Number(
                req.body.citiesCovered
            );
        }

        if (req.body.yearsOfTrust !== undefined) {
            aboutSection.yearsOfTrust = Number(
                req.body.yearsOfTrust
            );
        }

        if (files?.aboutImage?.length) {
            aboutSection.image = files.aboutImage[0].path;
        }

        if (Object.keys(aboutSection).length > 0) {
            aboutUsData.aboutSection = aboutSection;
        }

        // ==========================================
        // AWARD WINNER SECTION
        // ==========================================

        const awardWinnerSection: any = {};

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

        const awardImages = files?.awardImages || [];

        const awards = [];

        const awardCount = Math.max(
            awardTitles.length,
            awardSubtitles.length,
            awardImages.length
        );

        for (let i = 0; i < awardCount; i++) {
            const award: any = {};

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

        const howToUseSection: any = {};

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

        const stepCount = Math.max(
            stepTitles.length,
            stepDescriptions.length
        );

        for (let i = 0; i < stepCount; i++) {
            const step: any = {};

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

        const moneyBackGuaranteeSection: any = {};

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

        const secureSection: any = {};

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

        const featureCount = Math.max(
            securityTitles.length,
            securityDescriptions.length
        );

        for (let i = 0; i < featureCount; i++) {
            const feature: any = {};

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

        const validatedData =
            createAboutUsValidation.parse(aboutUsData);

        // ==========================================
        // CREATE / UPDATE
        // ==========================================

        const aboutUs = await AboutUs.findOneAndUpdate(
            { isDeleted: false },
            { $set: validatedData },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "About Us saved successfully.",
            data: aboutUs,
        });
    } catch (error: any) {
        console.error("About Us Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAboutUs = async (req: Request, res: Response): Promise<void> => {
    try {
        const aboutUs = await AboutUs.findOne({
            isDeleted: false,
        });

        res.status(200).json({
            success: true,
            data: aboutUs,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};