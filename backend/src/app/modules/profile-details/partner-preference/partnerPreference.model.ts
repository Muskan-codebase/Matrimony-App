import { Schema, model } from "mongoose";
import { IPartnerPreference } from "./partnerPreference.interface";

const partnerPreferenceSchema = new Schema<IPartnerPreference>(
    {
        basicDetails: {
            age: {
                minAge: {
                    type: Number,
                },
                maxAge: {
                    type: Number,
                },
            },

            height: {
                minHeight: {
                    type: Schema.Types.ObjectId,
                    ref: "Height",
                },

                maxHeight: {
                    type: Schema.Types.ObjectId,
                    ref: "Height",
                },
            },

            partnerCountry: [
                {
                    type: String,
                    trim: true,
                },
            ],

            partnerState: [
                {
                    type: String,
                    trim: true,
                },
            ],

            partnerCity: [
                {
                    type: String,
                    trim: true,
                },
            ],

            maritalStatus: {
                preferences: [
                    {
                        type: String,
                        enum: [
                            "Never Married",
                            "Divorce",
                            "Widow",
                            "Awaiting Divorce",
                        ],
                    },
                ],
            },
        },

        educationDetails: {
            doesntMatter: {
                type: Boolean,
                default: false,
            },

            highestDegrees: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Qualification",
                },
            ],

            wellKnownColleges: {
                    type: String,
                    trim: true,
                },

            occupation: {
                doesntMatter: {
                    type: Boolean,
                    default: false,
                },

                preferences: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: "Occupation",
                    },
                ],
            },

            annualIncome: {
                type: Schema.Types.ObjectId,
                ref: "AnnualIncome",
            },
        },

        familyDetails: {
            familyBasedOutOfCountry: {
                country: {
                    type: String,
                    trim: true,
                },
            },
        },

        religionAndEthnicity: {
            religion: {
                preference: {
                    type: Schema.Types.ObjectId,
                    ref: "Religion",
                },
            },

            caste: {
                preferences: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: "Caste",
                    },
                ],
            },

            subCaste: {
                preferences: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: "SubCaste",
                    },
                ],
            },

            motherTongue: {
                preference: {
                    type: Schema.Types.ObjectId,
                    ref: "MotherTongue",
                },
            },

            manglikStatus: {
                preferences: [
                    {
                        type: String,
                        enum: [
                            "Manglik",
                            "Non Manglik",
                            "Angshik (Partial Manglik)",
                            "Doesn't Matter",
                        ],
                    },
                ],
            },
        },

        lifestyleAndAppearance: {
            dietaryHabits: {
                preferences: [
                    {
                        type: String,
                        enum: [
                            "Vegetarian",
                            "Non Vegetarian",
                            "Jain",
                            "Eggetarian",
                            "Doesn't Matter",
                        ],
                    },
                ],
            },

            smokingHabits: {
                preferences: [
                    {
                        type: String,
                        enum: ["Yes", "No", "Occasionally", "Doesn't Matter"],
                    },
                ],
            },

            drinkingHabits: {
                preferences: [
                    {
                        type: String,
                        enum: ["Yes", "No", "Occasionally", "Doesn't Matter"],
                    },
                ],
            },

            disability: {
                preferences: [
                    {
                        type: String,
                        enum: [
                            "None",
                            "Physically disabled from birth",
                            "Physically disabled due to accident",
                            "Mentally disabled from birth",
                            "Mentally disabled due to accident",
                            "Doesn't Matter",
                        ],
                    },
                ],
            },
        },

        aboutMyPartner: {
            description: {
                type: String,
                trim: true,
                maxlength: 2000,
                default: "",
            },
        },

        createdBy: {
            type: String,
            required: true,
        },

        profileId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
            unique: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const PartnerPreference = model<IPartnerPreference>(
    "PartnerPreference",
    partnerPreferenceSchema
);