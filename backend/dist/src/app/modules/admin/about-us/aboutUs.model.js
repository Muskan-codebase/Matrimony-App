"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutUs = void 0;
const mongoose_1 = require("mongoose");
const ceoSectionSchema = new mongoose_1.Schema({
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
}, {
    _id: false,
});
const missionVisionSchema = new mongoose_1.Schema({
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
}, {
    _id: false,
});
const aboutSectionSchema = new mongoose_1.Schema({
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
}, {
    _id: false,
});
const awardSchema = new mongoose_1.Schema({
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
}, {
    _id: false,
});
const awardWinnerSectionSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        trim: true,
    },
    awards: {
        type: [awardSchema],
        default: [],
    },
}, {
    _id: false,
});
const howToUseStepSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    _id: false,
});
const howToUseSectionSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        trim: true,
    },
    steps: {
        type: [howToUseStepSchema],
        default: [],
    },
}, {
    _id: false,
});
const moneyBackGuaranteeSectionSchema = new mongoose_1.Schema({
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
}, {
    _id: false,
});
const securityFeatureSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    _id: false,
});
const secureSectionSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        trim: true,
        maxlength: 100,
    },
    features: {
        type: [securityFeatureSchema],
        default: [],
    },
}, {
    _id: false,
});
const aboutUsSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
exports.AboutUs = (0, mongoose_1.model)("AboutUs", aboutUsSchema);
