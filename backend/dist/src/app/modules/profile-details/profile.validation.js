"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.createProfileSchema = void 0;
const zod_1 = require("zod");
// Converts "" -> undefined
const optionalEnum = (values) => zod_1.z.preprocess((value) => value === "" ? undefined : value, zod_1.z.enum(values).optional());
// Converts "" -> undefined, then validates as email if present
const optionalEmail = () => zod_1.z.preprocess((value) => value === "" ? undefined : value, zod_1.z.string().email().optional());
// ======================================
// Basic Details
// ======================================
const basicDetailsSchema = zod_1.z.object({
    profileFor: zod_1.z.string().trim().optional(),
    gender: optionalEnum([
        "Male",
        "Female",
    ]),
    firstName: zod_1.z.string().trim().optional(),
    lastName: zod_1.z.string().trim().optional(),
    dob: zod_1.z.coerce.date().optional(),
    age: zod_1.z.number().optional(),
    height: zod_1.z.string().optional(),
    maritalStatus: optionalEnum([
        "Never Married",
        "Divorced",
        "Widowed",
        "Awaiting Divorce",
    ]),
});
// ======================================
// Education Details
// ======================================
const educationDetailsSchema = zod_1.z.object({
    highestQualification: zod_1.z.string().trim().optional(),
    educationType: zod_1.z.string().trim().optional(),
    occupation: zod_1.z.string().trim().optional(),
    annualIncome: zod_1.z.string().trim().optional(),
});
// ======================================
// Religion Details
// ======================================
const religionDetailsSchema = zod_1.z.object({
    religion: zod_1.z.string().trim().optional(),
    caste: zod_1.z.string().trim().optional(),
    subCaste: zod_1.z.string().trim().optional(),
    hasDosh: zod_1.z.boolean().optional(),
    motherTongue: zod_1.z.string().trim().optional(),
});
// ======================================
// Location Details
// ======================================
const locationDetailsSchema = zod_1.z.object({
    country: zod_1.z.string().trim().optional(),
    state: zod_1.z.string().trim().optional(),
    city: zod_1.z.string().trim().optional(),
});
// ======================================
// Additional Details
// ======================================
const additionalDetailsSchema = zod_1.z.object({
    classType: optionalEnum([
        "Middle Class",
        "Upper Middle Class",
        "Rich",
        "Affluent",
        "Elite",
    ]),
    brothers: optionalEnum([
        "None",
        "1",
        "2",
        "3",
        "3+",
    ]),
    marriedBrothers: optionalEnum([
        "None",
        "1",
        "2",
        "3",
        "3+",
    ]),
    sisters: optionalEnum([
        "None",
        "1",
        "2",
        "3",
        "3+",
    ]),
    marriedSisters: optionalEnum([
        "None",
        "1",
        "2",
        "3",
        "3+",
    ]),
    livingWithFamily: zod_1.z.boolean().optional(),
    familyLocation: zod_1.z.string().trim().optional(),
});
// ======================================
// Horoscope Details
// ======================================
const horoscopeDetailsSchema = zod_1.z.object({
    birthTime: zod_1.z.object({
        hour: zod_1.z.number().min(1).max(12).optional(),
        minute: zod_1.z.number().min(0).max(59).optional(),
        meridiem: optionalEnum([
            "AM",
            "PM",
        ]),
    }).optional(),
    birthPlace: zod_1.z.object({
        country: zod_1.z.string().trim().optional(),
        state: zod_1.z.string().trim().optional(),
        city: zod_1.z.string().trim().optional(),
    }).optional(),
    starDetails: zod_1.z.object({
        nakshatra: zod_1.z.string().trim().optional(),
        rashi: zod_1.z.string().trim().optional(),
    }).optional(),
});
// ======================================
// Lifestyle Details
// ======================================
const lifestyleDetailsSchema = zod_1.z.object({
    eatingHabit: optionalEnum([
        "Vegetarian",
        "Non Vegetarian",
        "Eggitarian",
    ]),
});
// ======================================
// Create Profile
// ======================================
// ======================================
// Update Profile
// ======================================
// ======================================
// Career Details
// ======================================
const careerDetailsSchema = zod_1.z.object({
    employedIn: zod_1.z.string().trim().optional(),
    occupation: zod_1.z.string().trim().optional(),
    organizationName: zod_1.z.string().trim().optional(),
    interestedInSettlingAbroad: zod_1.z.boolean().optional(),
});
const educationSchema = zod_1.z.object({
    aboutEducation: zod_1.z.string().trim().optional(),
    highestDegree: zod_1.z.string().trim().optional(),
    postGraduation: zod_1.z.string().trim().optional(),
    underGraduation: zod_1.z.string().trim().optional(),
    school: zod_1.z.string().trim().optional(),
});
const familySchema = zod_1.z.object({
    aboutFamily: zod_1.z.string().trim().optional(),
    fatherOccupation: zod_1.z.string().trim().optional(),
    motherOccupation: zod_1.z.string().trim().optional(),
    brothers: zod_1.z.string().trim().optional(),
    sisters: zod_1.z.string().trim().optional(),
    familyIncome: zod_1.z.string().trim().optional(),
    familyStatus: optionalEnum([
        "Middle Class",
        "Upper Middle Class",
        "Rich",
        "Affluent",
        "Elite",
    ]),
    familyType: optionalEnum([
        "Joint Family",
        "Nuclear Family",
    ]),
    familyValue: optionalEnum([
        "Traditional",
        "Moderate",
        "Liberal",
    ]),
    livingWithParents: zod_1.z.boolean().optional(),
    familyBasedOutOf: zod_1.z.string().trim().optional(),
});
const contactDetailsSchema = zod_1.z.object({
    email: optionalEmail(),
    alternateEmail: optionalEmail(),
    phoneNumber: zod_1.z.string().trim().optional(),
    alternatePhoneNumber: zod_1.z.string().trim().optional(),
    landlineNumber: zod_1.z.string().trim().optional(),
    relationshipWithBrideOrGroom: zod_1.z.string().trim().optional(),
});
const lifestyleSchema = zod_1.z.object({
    dietaryHabit: optionalEnum([
        "Vegetarian",
        "Non Vegetarian",
        "Eggitarian",
    ]),
    drinkingHabit: optionalEnum([
        "Never",
        "Occasionally",
        "Regularly",
    ]),
    smokingHabit: optionalEnum([
        "Never",
        "Occasionally",
        "Regularly",
    ]),
    openToPets: zod_1.z.boolean().optional(),
    ownHouse: zod_1.z.boolean().optional(),
    ownCar: zod_1.z.boolean().optional(),
    foodICook: zod_1.z.string().trim().optional(),
    hobbies: zod_1.z.array(zod_1.z.string()).optional(),
    favouriteMusic: zod_1.z.array(zod_1.z.string()).optional(),
    favouriteBooks: zod_1.z.array(zod_1.z.string()).optional(),
    dressStyle: zod_1.z.string().trim().optional(),
    sports: zod_1.z.array(zod_1.z.string()).optional(),
    cuisine: zod_1.z.array(zod_1.z.string()).optional(),
    movies: zod_1.z.array(zod_1.z.string()).optional(),
    favouriteRead: zod_1.z.array(zod_1.z.string()).optional(),
    tvShow: zod_1.z.array(zod_1.z.string()).optional(),
});
// ======================================
// About Me
// ======================================
const aboutMeSchema = zod_1.z.object({
    about: zod_1.z
        .string()
        .trim()
        .max(1000)
        .optional(),
    describeYourself: zod_1.z
        .string()
        .trim()
        .max(100)
        .optional(),
    profileCreatedBy: optionalEnum([
        "Self",
        "Parents",
        "Sibling",
        "Relative/Friend",
        "Guardian",
    ]),
    languagesISpeak: zod_1.z
        .array(zod_1.z.string())
        .optional(),
    disability: optionalEnum([
        "None",
        "Physical Disability",
        "Hearing Impairment",
        "Visual Impairment",
        "Speech Impairment",
        "Other",
    ]),
    thalassemia: optionalEnum([
        "No",
        "Minor",
        "Major",
        "Carrier",
    ]),
    hivStatus: zod_1.z.boolean().optional(),
});
exports.createProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        basicDetails: basicDetailsSchema.optional(),
        educationDetails: educationDetailsSchema.optional(),
        education: educationSchema.optional(),
        careerDetails: careerDetailsSchema.optional(),
        religionDetails: religionDetailsSchema.optional(),
        locationDetails: locationDetailsSchema.optional(),
        additionDetails: additionalDetailsSchema.optional(),
        lifestyleDetails: lifestyleDetailsSchema.optional(),
        family: familySchema.optional(),
        horoscopeDetails: horoscopeDetailsSchema.optional(),
        contactDetails: contactDetailsSchema.optional(),
        lifestyle: lifestyleSchema.optional(),
        aboutMe: aboutMeSchema.optional().optional(),
        photos: zod_1.z.array(zod_1.z.string()).optional(),
    }).partial()
});
exports.updateProfileSchema = exports.createProfileSchema;
