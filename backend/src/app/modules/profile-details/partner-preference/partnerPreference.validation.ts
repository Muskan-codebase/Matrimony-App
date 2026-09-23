import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// Converts null -> undefined so optional/default schemas treat an explicit
// `null` the same as a missing key, instead of throwing "Expected object,
// received null" / "Expected array, received null".
const nullToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((value) => (value === null ? undefined : value), schema);

// Converts "" or null -> undefined, then validates as an enum value if present.
const optionalEnum = <T extends [string, ...string[]]>(values: T) =>
    z.preprocess(
        (value) => (value === "" || value === null ? undefined : value),
        z.enum(values).optional()
    );

// Converts "" or null -> undefined, then validates as an ObjectId if present.
// Fixes fields like annualIncome, minHeight, religion.preference, etc.
// rejecting blank form fields ("") with "Invalid ObjectId".
const optionalObjectId = () =>
    z.preprocess(
        (value) => (value === "" || value === null ? undefined : value),
        objectId.optional()
    );

// Array of enum values (multi-select preferences). Accepts null (-> []),
// and filters out "" / null / undefined entries within the array itself.
const optionalEnumArray = <T extends [string, ...string[]]>(values: T) =>
    z.preprocess(
        (value) => {
            if (value === null || value === undefined) return [];
            if (Array.isArray(value)) {
                return value.filter((v) => v !== "" && v !== null && v !== undefined);
            }
            return value;
        },
        z.array(z.enum(values)).default([])
    );

// Plain string array (e.g. partnerCountry). Accepts null -> [].
const optionalStringArray = () =>
    z.preprocess(
        (value) => (value === null || value === undefined ? [] : value),
        z.array(z.string()).default([])
    );

// ObjectId array (e.g. highestDegrees). Accepts null -> [], and filters
// out "" / null / undefined entries within the array itself.
const optionalObjectIdArray = () =>
    z.preprocess(
        (value) => {
            if (value === null || value === undefined) return undefined;

            if (Array.isArray(value)) {
                return value.filter(
                    (v) => v !== "" && v !== null && v !== undefined
                );
            }

            return value;
        },
        z.array(objectId).optional()
    );

export const createPartnerPreferenceSchema = z.object({
    body: z.object({

        createdBy: nullToUndefined(z.string().optional()),

        basicDetails: nullToUndefined(z.object({
            age: nullToUndefined(z.object({
                minAge: z
                    .number()
                    .min(18, "Minimum age should be at least 18")
                    .optional(),

                maxAge: z
                    .number()
                    .max(100, "Maximum age cannot exceed 100")
                    .optional(),
            }).optional()),

            height: nullToUndefined(z.object({
                minHeight: optionalObjectId(),
                maxHeight: optionalObjectId(),
            }).optional()),

            partnerCountry: optionalStringArray(),

            partnerState: optionalStringArray(),

            partnerCity: optionalStringArray(),

            maritalStatus: nullToUndefined(z.object({
                preferences: optionalEnumArray([
                    "Never Married",
                    "Divorce",
                    "Widow",
                    "Awaiting Divorce",
                ]),
            }).optional()),
        }).optional()),

        educationDetails: nullToUndefined(z.object({
            doesntMatter: z.boolean().default(false),

            highestDegrees: optionalObjectIdArray(),

            wellKnownColleges: z.preprocess(
                (value) => (value === null ? undefined : value),
                z.string().trim().optional()
            ),

            occupation: nullToUndefined(z.object({
                doesntMatter: z.boolean().default(false),

                preferences: optionalObjectIdArray(),
            }).optional()),

            annualIncome: optionalObjectId(),
        }).optional()),

        familyDetails: nullToUndefined(z.object({
            familyBasedOutOfCountry: nullToUndefined(z.object({
                country: z.string().optional(),
            }).optional()),
        }).optional()),

        religionAndEthnicity: nullToUndefined(z.object({
            religion: nullToUndefined(z.object({
                preference: optionalObjectId(),
            }).optional()),

            caste: nullToUndefined(z.object({
                preferences: optionalObjectIdArray(),
            }).optional()),

            subCaste: nullToUndefined(z.object({
                preferences: optionalObjectIdArray(),
            }).optional()),

            motherTongue: nullToUndefined(z.object({
                preference: optionalObjectId(),
            }).optional()),

            manglikStatus: nullToUndefined(z.object({
                preferences: optionalEnumArray([
                    "Manglik",
                    "Non Manglik",
                    "Angshik (Partial Manglik)",
                    "Doesn't Matter",
                ]),
            }).optional()),
        }).optional()),

        lifestyleAndAppearance: nullToUndefined(z.object({
            dietaryHabits: nullToUndefined(z.object({
                preferences: optionalEnumArray([
                    "Vegetarian",
                    "Non Vegetarian",
                    "Jain",
                    "Eggetarian",
                    "Doesn't Matter",
                ]),
            }).optional()),

            smokingHabits: nullToUndefined(z.object({
                preferences: optionalEnumArray([
                    "Yes",
                    "No",
                    "Occasionally",
                    "Doesn't Matter",
                ]),
            }).optional()),

            drinkingHabits: nullToUndefined(z.object({
                preferences: optionalEnumArray([
                    "Yes",
                    "No",
                    "Occasionally",
                    "Doesn't Matter",
                ]),
            }).optional()),

            disability: nullToUndefined(z.object({
                preferences: optionalEnumArray([
                    "None",
                    "Physically disabled from birth",
                    "Physically disabled due to accident",
                    "Mentally disabled from birth",
                    "Mentally disabled due to accident",
                    "Doesn't Matter",
                ]),
            }).optional()),
        }).optional()),

        aboutMyPartner: nullToUndefined(z.object({
            description: z
                .string()
                .max(2000, "Description cannot exceed 2000 characters")
                .optional(),
        }).optional()),

    }),
});
