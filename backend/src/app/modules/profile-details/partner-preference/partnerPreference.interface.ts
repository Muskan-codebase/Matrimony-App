import { Document, Types } from "mongoose";

export interface IPartnerPreference extends Document {
    basicDetails: {
        age: {
            minAge?: number;
            maxAge?: number;
        };

        height: {
            minHeight?: Types.ObjectId;
            maxHeight?: Types.ObjectId;
        };

        partnerCountry: string[];

        partnerState: string[];

        partnerCity: string[];

        maritalStatus: {
            preferences: (
                | "Never Married"
                | "Divorce"
                | "Widow"
                | "Awaiting Divorce"
            )[];
        };
    };

    educationDetails: {
        doesntMatter: boolean;

        highestDegrees: Types.ObjectId[];

        wellKnownColleges: string;

        occupation: {
            doesntMatter: boolean;
            preferences: Types.ObjectId[];
        };

        annualIncome?: Types.ObjectId;
    };

    familyDetails: {
        familyBasedOutOfCountry: {
            country?: string;
        };
    };

    religionAndEthnicity: {
        religion: {
            preference?: Types.ObjectId;
        };

        caste: {
            preferences: Types.ObjectId[];
        };

        subCaste: {
            preferences: Types.ObjectId[];
        };

        motherTongue: {
            preference?: Types.ObjectId;
        };

        manglikStatus: {
            preferences: (
                | "Manglik"
                | "Non Manglik"
                | "Angshik (Partial Manglik)"
                | "Doesn't Matter"
            )[];
        };
    };

    lifestyleAndAppearance: {
        dietaryHabits: {
            preferences: (
                | "Vegetarian"
                | "Non Vegetarian"
                | "Jain"
                | "Eggetarian"
                | "Doesn't Matter"
            )[];
        };

        smokingHabits: {
            preferences: (
                | "Yes"
                | "No"
                | "Occasionally"
                | "Doesn't Matter"
            )[];
        };

        drinkingHabits: {
            preferences: (
                | "Yes"
                | "No"
                | "Occasionally"
                | "Doesn't Matter"
            )[];
        };

        disability: {
            preferences: (
                | "None"
                | "Physically disabled from birth"
                | "Physically disabled due to accident"
                | "Mentally disabled from birth"
                | "Mentally disabled due to accident"
                | "Doesn't Matter"
            )[];
        };
    };

    aboutMyPartner: {
        description?: string;
    };

    createdBy: string;

    profileId: Types.ObjectId;

    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}