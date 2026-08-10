"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
        unique: true,
    },
    matrimonyId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        immutable: true,
    },
    // ===================================
    // Basic Details
    // ===================================
    basicDetails: {
        profileFor: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["Male", "Female"],
        },
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        dob: {
            type: Date,
        },
        age: {
            type: Number,
        },
        height: {
            type: String,
        },
        maritalStatus: {
            type: String,
            enum: [
                "Never Married",
                "Divorced",
                "Widowed",
                "Awaiting Divorce",
            ],
        },
    },
    // ===================================
    // Education
    // ===================================
    educationDetails: {
        highestQualification: {
            type: String,
        },
        educationType: {
            type: String,
        },
        occupation: {
            type: String,
        },
        annualIncome: {
            type: String,
        },
    },
    // ===================================
    // Religion
    // ===================================
    religionDetails: {
        religion: {
            type: String,
        },
        caste: {
            type: String,
        },
        subCaste: {
            type: String,
        },
        hasDosh: {
            type: Boolean,
            default: false,
        },
        motherTongue: {
            type: String,
        },
    },
    // ===================================
    // Location
    // ===================================
    locationDetails: {
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        city: {
            type: String,
        },
    },
    // ===================================
    // Additional Details
    // ===================================
    additionalDetails: {
        classType: {
            type: String,
            enum: [
                "Middle Class",
                "Upper Middle Class",
                "Rich",
                "Affluent",
                "Elite",
            ],
        },
        brothers: {
            type: String,
            enum: [
                "None",
                "1",
                "2",
                "3",
                "3+",
            ],
        },
        marriedBrothers: {
            type: String,
            enum: [
                "None",
                "1",
                "2",
                "3",
                "3+",
            ],
        },
        sisters: {
            type: String,
            enum: [
                "None",
                "1",
                "2",
                "3",
                "3+",
            ],
        },
        marriedSisters: {
            type: String,
            enum: [
                "None",
                "1",
                "2",
                "3",
                "3+",
            ],
        },
        livingWithFamily: {
            type: Boolean,
        },
        familyLocation: {
            type: String,
        },
    },
    // ===================================
    // Horoscope
    // ===================================
    horoscopeDetails: {
        birthTime: {
            hour: Number,
            minute: Number,
            meridiem: {
                type: String,
                enum: ["AM", "PM"],
            },
        },
        birthPlace: {
            country: String,
            state: String,
            city: String,
        },
        starDetails: {
            nakshatra: String,
            rashi: String,
        },
    },
    // ===================================
    // Lifestyle
    // ===================================
    lifestyleDetails: {
        eatingHabit: {
            type: String,
            enum: [
                "Vegetarian",
                "Non Vegetarian",
                "Eggitarian",
            ],
        },
    },
    // ===================================
    // About
    // ===================================
    // ===================================
    // About Me
    // ===================================
    aboutMe: {
        about: {
            type: String,
            maxlength: 1000,
            trim: true,
        },
        describeYourself: {
            type: String,
            maxlength: 100,
            trim: true,
        },
        profileCreatedBy: {
            type: String,
            trim: true,
        },
        languagesISpeak: {
            type: [String],
            default: [],
        },
        disability: {
            type: String,
            trim: true,
        },
        thalassemia: {
            type: String,
            trim: true,
        },
        hivStatus: {
            type: Boolean,
        },
    },
    // ===================================
    // Photos
    // ===================================
    photos: {
        type: [String],
        default: [],
    },
    // ===================================
    // Career Details
    // ===================================
    careerDetails: {
        employedIn: {
            type: String,
        },
        occupation: {
            type: String,
        },
        organizationName: {
            type: String,
            trim: true,
        },
        interestedInSettlingAbroad: {
            type: Boolean,
        },
    },
    education: {
        aboutEducation: {
            type: String,
            trim: true,
        },
        highestDegree: {
            type: String,
        },
        postGraduation: {
            type: String,
        },
        underGraduation: {
            type: String,
        },
        school: {
            type: String,
        },
    },
    family: {
        aboutFamily: {
            type: String,
            trim: true,
        },
        fatherOccupation: {
            type: String,
        },
        motherOccupation: {
            type: String,
        },
        brothers: {
            type: String,
        },
        sisters: {
            type: String,
        },
        familyIncome: {
            type: String,
        },
        familyStatus: {
            type: String,
            enum: [
                "Middle Class",
                "Upper Middle Class",
                "Rich",
                "Affluent",
                "Elite",
            ],
        },
        familyType: {
            type: String,
        },
        familyValue: {
            type: String,
        },
        livingWithParents: {
            type: Boolean,
        },
        familyBasedOutOf: {
            type: String,
        },
    },
    contactDetails: {
        email: {
            type: String,
            trim: true,
        },
        alternateEmail: {
            type: String,
            trim: true,
        },
        phoneNumber: {
            type: String,
        },
        alternatePhoneNumber: {
            type: String,
        },
        landlineNumber: {
            type: String,
        },
        relationshipWithBrideOrGroom: {
            type: String,
        },
    },
    lifestyle: {
        dietaryHabit: {
            type: String,
            enum: [
                "Vegetarian",
                "Non Vegetarian",
                "Eggitarian",
            ],
        },
        drinkingHabit: {
            type: String,
            enum: [
                "Never",
                "Occasionally",
                "Regularly",
            ],
        },
        smokingHabit: {
            type: String,
            enum: [
                "Never",
                "Occasionally",
                "Regularly",
            ],
        },
        openToPets: {
            type: Boolean,
        },
        ownHouse: {
            type: Boolean,
        },
        ownCar: {
            type: Boolean,
        },
        foodICook: {
            type: String,
        },
        hobbies: {
            type: [String],
            default: [],
        },
        favouriteMusic: {
            type: [String],
            default: [],
        },
        favouriteBooks: {
            type: [String],
            default: [],
        },
        dressStyle: {
            type: String,
        },
        sports: {
            type: [String],
            default: [],
        },
        cuisine: {
            type: [String],
            default: [],
        },
        movies: {
            type: [String],
            default: [],
        },
        favouriteRead: {
            type: [String],
            default: [],
        },
        tvShow: {
            type: [String],
            default: [],
        },
    },
    // // ===================================
    // // Profile Completion
    // // ===================================
    // profileCompleted: {
    //     type: Boolean,
    //     default: false,
    // },
    // completionPercentage: {
    //     type: Number,
    //     default: 0,
    //     min: 0,
    //     max: 100,
    // },
    // ===================================
    // Subscription Details
    // ===================================
    subscription: {
        isActive: {
            type: Boolean,
            default: false,
        },
        packageId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Package",
        },
        startDate: {
            type: Date,
        },
        expiryDate: {
            type: Date,
        },
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});
exports.Profile = (0, mongoose_1.model)("Profile", profileSchema);
