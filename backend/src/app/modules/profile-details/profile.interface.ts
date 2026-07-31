import { Types } from "mongoose";

export interface IProfile {

    userId: Types.ObjectId;
    matrimonyId: string;

    // =========================
    // Basic Details
    // =========================

    basicDetails: {

        profileFor: string;

        gender: string;

        firstName: string;

        lastName: string;

        dob: Date;

        age: number;

        height: string;

        maritalStatus: string;

    };

    // =========================
    // Education Details
    // =========================

    educationDetails: {

        highestQualification: string;

        educationType: string;

        occupation: string;

        annualIncome: string;

    };

    // =========================
    // Religion Details
    // =========================

    religionDetails: {

        religion: string;

        caste: string;

        subCaste: string;

        hasDosh: boolean;

        motherTongue: string;

    };

    // =========================
    // Location Details
    // =========================

    locationDetails: {

        country: string;

        state: string;

        city: string;

    };

    // =========================
    // Family Details
    // =========================

    additionalDetails: {

        classType: string;

        brothers: string;

        marriedBrothers: string;

        sisters: string;

        marriedSisters: string;

        livingWithFamily: boolean;

        familyLocation: string;

    };

    // =========================
    // Horoscope Details
    // =========================

    horoscopeDetails: {

        birthTime: {

            hour: number;

            minute: number;

            meridiem: string;

        };

        birthPlace: {

            country: string;

            state: string;

            city: string;

        };

        starDetails: {

            nakshatra: string;

            rashi: string;

        };

    };

    // =========================
    // Lifestyle
    // =========================

    lifestyleDetails: {

        eatingHabit: string;

    };

    // =========================
    // About
    // =========================

    aboutMe: {

        about: string;

        describeYourself: string;

        profileCreatedBy: string;

        languagesISpeak: string[];

        disability: string;

        thalassemia: string;

        hivStatus: boolean;

    };

    // =========================
    // Career Details
    // =========================

    careerDetails: {

        employedIn: string;

        occupation: string;

        organizationName: string;

        interestedInSettlingAbroad: boolean;

    };

    education: {

        aboutEducation: string;

        highestDegree: string;

        postGraduation: string;

        underGraduation: string;

        school: string;

    };

    family: {

        aboutFamily: string;

        fatherOccupation: string;

        motherOccupation: string;

        brothers: string;

        sisters: string;

        familyIncome: string;

        familyStatus: string;

        familyType: string;

        familyValue: string;

        livingWithParents: boolean;

        familyBasedOutOf: string;

    };

    contactDetails: {

        email: string;

        alternateEmail: string;

        phoneNumber: string;

        alternatePhoneNumber: string;

        landlineNumber: string;

        relationshipWithBrideOrGroom: string;

    };

    lifestyle: {

        dietaryHabit: string;

        drinkingHabit: string;

        smokingHabit: string;

        openToPets: boolean;

        ownHouse: boolean;

        ownCar: boolean;

        foodICook: string;

        hobbies: string[];

        favouriteMusic: string[];

        favouriteBooks: string[];

        dressStyle: string;

        sports: string[];

        cuisine: string[];

        movies: string[];

        favouriteRead: string[];

        tvShow: string[];

    };
    // =========================
    // Photos
    // =========================

    photos: string[];

    // =========================
    // Subscription Details
    // =========================

    subscription: {

        isActive: boolean;

        packageId?: Types.ObjectId;

        startDate?: Date;

        expiryDate?: Date;

    };
    isDeleted?: Boolean

    // =========================
    // Profile Status
    // =========================

    // profileCompleted: boolean;

    // completionPercentage: number;

}