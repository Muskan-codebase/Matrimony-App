"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPartnerPreferenceSchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
// Converts null -> undefined so optional/default schemas treat an explicit
// `null` the same as a missing key, instead of throwing "Expected object,
// received null" / "Expected array, received null".
const nullToUndefined = (schema) => zod_1.z.preprocess((value) => (value === null ? undefined : value), schema);
// Converts "" or null -> undefined, then validates as an enum value if present.
const optionalEnum = (values) => zod_1.z.preprocess((value) => (value === "" || value === null ? undefined : value), zod_1.z.enum(values).optional());
// Converts "" or null -> undefined, then validates as an ObjectId if present.
// Fixes fields like annualIncome, minHeight, religion.preference, etc.
// rejecting blank form fields ("") with "Invalid ObjectId".
const optionalObjectId = () => zod_1.z.preprocess((value) => (value === "" || value === null ? undefined : value), objectId.optional());
// Array of enum values (multi-select preferences). Accepts null (-> []),
// and filters out "" / null / undefined entries within the array itself.
const optionalEnumArray = (values) => zod_1.z.preprocess((value) => {
    if (value === null || value === undefined)
        return [];
    if (Array.isArray(value)) {
        return value.filter((v) => v !== "" && v !== null && v !== undefined);
    }
    return value;
}, zod_1.z.array(zod_1.z.enum(values)).default([]));
// Plain string array (e.g. partnerCountry). Accepts null -> [].
const optionalStringArray = () => zod_1.z.preprocess((value) => (value === null || value === undefined ? [] : value), zod_1.z.array(zod_1.z.string()).default([]));
// ObjectId array (e.g. highestDegrees). Accepts null -> [], and filters
// out "" / null / undefined entries within the array itself.
const optionalObjectIdArray = () => zod_1.z.preprocess((value) => {
    if (value === null || value === undefined)
        return undefined;
    if (Array.isArray(value)) {
        return value.filter((v) => v !== "" && v !== null && v !== undefined);
    }
    return value;
}, zod_1.z.array(objectId).optional());
exports.createPartnerPreferenceSchema = zod_1.z.object({
    body: zod_1.z.object({
        createdBy: nullToUndefined(zod_1.z.string().optional()),
        basicDetails: nullToUndefined(zod_1.z.object({
            age: nullToUndefined(zod_1.z.object({
                minAge: zod_1.z
                    .number()
                    .min(18, "Minimum age should be at least 18")
                    .optional(),
                maxAge: zod_1.z
                    .number()
                    .max(100, "Maximum age cannot exceed 100")
                    .optional(),
            }).optional()),
            height: nullToUndefined(zod_1.z.object({
                minHeight: optionalObjectId(),
                maxHeight: optionalObjectId(),
            }).optional()),
            partnerCountry: optionalStringArray(),
            partnerState: optionalStringArray(),
            partnerCity: optionalStringArray(),
            maritalStatus: nullToUndefined(zod_1.z.object({
                preferences: optionalEnumArray([
                    "Never Married",
                    "Divorce",
                    "Widow",
                    "Awaiting Divorce",
                ]),
            }).optional()),
        }).optional()),
        educationDetails: nullToUndefined(zod_1.z.object({
            doesntMatter: zod_1.z.boolean().default(false),
            highestDegrees: optionalObjectIdArray(),
            wellKnownColleges: zod_1.z.preprocess((value) => (value === null ? undefined : value), zod_1.z.string().trim().optional()),
            occupation: nullToUndefined(zod_1.z.object({
                doesntMatter: zod_1.z.boolean().default(false),
                preferences: optionalObjectIdArray(),
            }).optional()),
            annualIncome: optionalObjectId(),
        }).optional()),
        familyDetails: nullToUndefined(zod_1.z.object({
            familyBasedOutOfCountry: nullToUndefined(zod_1.z.object({
                country: zod_1.z.string().optional(),
            }).optional()),
        }).optional()),
        religionAndEthnicity: nullToUndefined(zod_1.z.object({
            religion: nullToUndefined(zod_1.z.object({
                preference: optionalObjectId(),
            }).optional()),
            caste: nullToUndefined(zod_1.z.object({
                preferences: optionalObjectIdArray(),
            }).optional()),
            subCaste: nullToUndefined(zod_1.z.object({
                preferences: optionalObjectIdArray(),
            }).optional()),
            motherTongue: nullToUndefined(zod_1.z.object({
                preference: optionalObjectId(),
            }).optional()),
            manglikStatus: nullToUndefined(zod_1.z.object({
                preferences: optionalEnumArray([
                    "Manglik",
                    "Non Manglik",
                    "Angshik (Partial Manglik)",
                    "Doesn't Matter",
                ]),
            }).optional()),
        }).optional()),
        lifestyleAndAppearance: nullToUndefined(zod_1.z.object({
            dietaryHabits: nullToUndefined(zod_1.z.object({
                preferences: optionalEnumArray([
                    "Vegetarian",
                    "Non Vegetarian",
                    "Jain",
                    "Eggetarian",
                    "Doesn't Matter",
                ]),
            }).optional()),
            smokingHabits: nullToUndefined(zod_1.z.object({
                preferences: optionalEnumArray([
                    "Yes",
                    "No",
                    "Occasionally",
                    "Doesn't Matter",
                ]),
            }).optional()),
            drinkingHabits: nullToUndefined(zod_1.z.object({
                preferences: optionalEnumArray([
                    "Yes",
                    "No",
                    "Occasionally",
                    "Doesn't Matter",
                ]),
            }).optional()),
            disability: nullToUndefined(zod_1.z.object({
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
        aboutMyPartner: nullToUndefined(zod_1.z.object({
            description: zod_1.z
                .string()
                .max(2000, "Description cannot exceed 2000 characters")
                .optional(),
        }).optional()),
    }),
});
