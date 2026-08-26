import { Schema, model } from "mongoose";
import { IAboutUs } from "./aboutUs.interface";

const ceoSectionSchema = new Schema(
    {
        heading: {
            type: String,
            trim: true,
        },

        image: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        designation: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const missionVisionSchema = new Schema(
    {
        heading: {
            type: String,
            trim: true,
        },

        missionTitle: {
            type: String,
            trim: true,
        },

        missionDescription: {
            type: String,
            trim: true,
        },

        visionTitle: {
            type: String,
            trim: true,
        },

        visionDescription: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const aboutSectionSchema = new Schema(
    {
        heading: {
            type: String,
            trim: true,
        },

        image: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        verifiedProfiles: {
            type: Number,
            default: 0,
        },

        successfulMatches: {
            type: Number,
            default: 0,
        },

        citiesCovered: {
            type: Number,
            default: 0,
        },

        yearsOfTrust: {
            type: Number,
            default: 0,
        },
    },
    {
        _id: false,
    }
);

const awardSchema = new Schema(
    {
        image: {
            type: String,
            trim: true,
        },

        title: {
            type: String,
            trim: true,
        },

        subtitle: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const awardWinnerSectionSchema = new Schema(
    {
        heading: {
            type: String,
            trim: true,
        },

        awards: {
            type: [awardSchema],
            default: [],
        },
    },
    {
        _id: false,
    }
);

const howToUseStepSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const howToUseSectionSchema = new Schema(
    {
        heading: {
            type: String,
            trim: true,
        },

        steps: {
            type: [howToUseStepSchema],
            default: [],
        },
    },
    {
        _id: false,
    }
);

const moneyBackGuaranteeSectionSchema = new Schema(
    {
        heading: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        note: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const securityFeatureSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const secureSectionSchema = new Schema(
    {
        heading: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        features: {
            type: [securityFeatureSchema],
            default: [],
        },
    },
    {
        _id: false,
    }
);

const aboutUsSchema = new Schema<IAboutUs>(
    {
        ceoSection: {
            type: ceoSectionSchema,
        },

        missionVisionSection: {
            type: missionVisionSchema,
        },

        aboutSection: {
            type: aboutSectionSchema,
        },

        awardWinnerSection: {
            type: awardWinnerSectionSchema,
        },

        howToUseSection: {
            type: howToUseSectionSchema,
        },

        moneyBackGuaranteeSection: {
            type: moneyBackGuaranteeSectionSchema,
        },

        secureSection: {
            type: secureSectionSchema,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const AboutUs = model<IAboutUs>(
    "AboutUs",
    aboutUsSchema
);