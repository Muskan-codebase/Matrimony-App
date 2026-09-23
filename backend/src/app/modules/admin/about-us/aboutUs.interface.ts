import { Document } from "mongoose";

export interface ICEOSection {
    heading: string;
    image: string;
    description: string;
    designation: string;
}

export interface IMissionVisionSection {
    heading: string;

    missionTitle: string;
    missionDescription: string;

    visionTitle: string;
    visionDescription: string;
}

export interface IAboutSection {
    heading: string;
    image: string;
    description: string;

    verifiedProfiles: number;
    successfulMatches: number;
    citiesCovered: number;
    yearsOfTrust: number;
}

export interface IAwardWinner {
    image: string;
    title: string;
    subtitle: string;
}

export interface IAwardWinnerSection {
    heading: string;
    awards: IAwardWinner[];
}

export interface IHowToUseStep {
    title: string;
    description: string;
}

export interface IHowToUseSection {
    heading: string;
    steps: IHowToUseStep[];
}

export interface IMoneyBackGuaranteeSection {
    heading: string;
    description: string;
    note: string;
}

export interface ISecurityFeature {
    title: string;
    description: string;
}

export interface ISecureSection {
    heading: string;
    features: ISecurityFeature[];
}

export interface IAboutUs extends Document {
    ceoSection: ICEOSection;

    missionVisionSection: IMissionVisionSection;

    aboutSection: IAboutSection;

    awardWinnerSection: IAwardWinnerSection;

    howToUseSection: IHowToUseSection;

    moneyBackGuaranteeSection: IMoneyBackGuaranteeSection;

    secureSection: ISecureSection;

    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}