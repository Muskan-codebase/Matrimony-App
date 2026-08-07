import { z } from "zod";

// Converts "" -> undefined
const optionalEnum = <T extends [string, ...string[]]>(values: T) =>
    z.preprocess(
        (value) => value === "" ? undefined : value,
        z.enum(values).optional()
    );

// Converts "" -> undefined, then validates as email if present
const optionalEmail = () =>
    z.preprocess(
        (value) => value === "" ? undefined : value,
        z.string().email().optional()
    );

// ======================================
// Basic Details
// ======================================

const basicDetailsSchema = z.object({

    profileFor: z.string().trim().optional(),

    gender: optionalEnum([
        "Male",
        "Female",
    ]),

    firstName: z.string().trim().optional(),

    lastName: z.string().trim().optional(),

    dob: z.coerce.date().optional(),

    age: z.number().optional(),

    height: z.string().optional(),

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

const educationDetailsSchema = z.object({

    highestQualification: z.string().trim().optional(),

    educationType: z.string().trim().optional(),

    occupation: z.string().trim().optional(),

    annualIncome: z.string().trim().optional(),

});

// ======================================
// Religion Details
// ======================================

const religionDetailsSchema = z.object({

    religion: z.string().trim().optional(),

    caste: z.string().trim().optional(),

    subCaste: z.string().trim().optional(),

    hasDosh: z.boolean().optional(),

    motherTongue: z.string().trim().optional(),

});

// ======================================
// Location Details
// ======================================

const locationDetailsSchema = z.object({

    country: z.string().trim().optional(),

    state: z.string().trim().optional(),

    city: z.string().trim().optional(),

});

// ======================================
// Additional Details
// ======================================

const additionalDetailsSchema = z.object({

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

    livingWithFamily: z.boolean().optional(),

    familyLocation: z.string().trim().optional(),

});

// ======================================
// Horoscope Details
// ======================================

const horoscopeDetailsSchema = z.object({

    birthTime: z.object({

        hour: z.number().min(1).max(12).optional(),

        minute: z.number().min(0).max(59).optional(),

        meridiem: optionalEnum([
            "AM",
            "PM",
        ]),

    }).optional(),

    birthPlace: z.object({

        country: z.string().trim().optional(),

        state: z.string().trim().optional(),

        city: z.string().trim().optional(),

    }).optional(),

    starDetails: z.object({

        nakshatra: z.string().trim().optional(),

        rashi: z.string().trim().optional(),

    }).optional(),

});

// ======================================
// Lifestyle Details
// ======================================

const lifestyleDetailsSchema = z.object({

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

const careerDetailsSchema = z.object({

    employedIn: z.string().trim().optional(),

    occupation: z.string().trim().optional(),

    organizationName: z.string().trim().optional(),

    interestedInSettlingAbroad: z.boolean().optional(),

});

const educationSchema = z.object({

    aboutEducation: z.string().trim().optional(),

    highestDegree: z.string().trim().optional(),

    postGraduation: z.string().trim().optional(),

    underGraduation: z.string().trim().optional(),

    school: z.string().trim().optional(),

});

const familySchema = z.object({

    aboutFamily: z.string().trim().optional(),

    fatherOccupation: z.string().trim().optional(),

    motherOccupation: z.string().trim().optional(),

    brothers: z.string().trim().optional(),

    sisters: z.string().trim().optional(),

    familyIncome: z.string().trim().optional(),

    familyStatus: optionalEnum([
        "Middle Class",
        "Upper Middle Class",
        "Rich",
        "Affluent",
        "Elite",
    ]),

    familyType: z.string().trim().optional(),

    familyValue: z.string().trim().optional(),

    livingWithParents: z.boolean().optional(),

    familyBasedOutOf: z.string().trim().optional(),

});

const contactDetailsSchema = z.object({

    email: optionalEmail(),

    alternateEmail: optionalEmail(),

    phoneNumber: z.string().trim().optional(),

    alternatePhoneNumber: z.string().trim().optional(),

    landlineNumber: z.string().trim().optional(),

    relationshipWithBrideOrGroom: z.string().trim().optional(),

});

const lifestyleSchema = z.object({

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

    openToPets: z.boolean().optional(),

    ownHouse: z.boolean().optional(),

    ownCar: z.boolean().optional(),

    foodICook: z.string().trim().optional(),

    hobbies: z.array(z.string()).optional(),

    favouriteMusic: z.array(z.string()).optional(),

    favouriteBooks: z.array(z.string()).optional(),

    dressStyle: z.string().trim().optional(),

    sports: z.array(z.string()).optional(),

    cuisine: z.array(z.string()).optional(),

    movies: z.array(z.string()).optional(),

    favouriteRead: z.array(z.string()).optional(),

    tvShow: z.array(z.string()).optional(),

});

// ======================================
// About Me
// ======================================

const aboutMeSchema = z.object({

    about: z
        .string()
        .trim()
        .max(1000)
        .optional(),

    describeYourself: z
        .string()
        .trim()
        .max(100)
        .optional(),

    profileCreatedBy: z.string().trim().optional(),

    languagesISpeak: z
        .array(z.string())
        .optional(),

    disability: z.string().trim().optional(),

    thalassemia: z.string().trim().optional(),

    hivStatus: z.boolean().optional(),

});

export const createProfileSchema = z.object({

    body: z.object({

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

        photos: z.array(z.string()).optional(),

    }).partial()

});

export const updateProfileSchema = createProfileSchema;