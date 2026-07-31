"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutUs = void 0;
const mongoose_1 = require("mongoose");
const ceoSectionSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    designation: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
}, {
    _id: false,
});
const missionVisionSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    missionTitle: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    missionDescription: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    visionTitle: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    visionDescription: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
}, {
    _id: false,
});
const aboutSectionSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    verifiedProfiles: {
        type: Number,
        required: true,
        default: 0,
    },
    successfulMatches: {
        type: Number,
        required: true,
        default: 0,
    },
    citiesCovered: {
        type: Number,
        required: true,
        default: 0,
    },
    yearsOfTrust: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    _id: false,
});
const awardSchema = new mongoose_1.Schema({
    image: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
    },
    subtitle: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
    },
}, {
    _id: false,
});
const awardWinnerSectionSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
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
        required: true,
        trim: true,
        maxlength: 150,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
}, {
    _id: false,
});
const howToUseSectionSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
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
        required: true,
        trim: true,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    note: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
    },
}, {
    _id: false,
});
const securityFeatureSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
}, {
    _id: false,
});
const secureSectionSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        required: true,
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
        required: true,
    },
    missionVisionSection: {
        type: missionVisionSchema,
        required: true,
    },
    aboutSection: {
        type: aboutSectionSchema,
        required: true,
    },
    awardWinnerSection: {
        type: awardWinnerSectionSchema,
        required: true,
    },
    howToUseSection: {
        type: howToUseSectionSchema,
        required: true,
    },
    moneyBackGuaranteeSection: {
        type: moneyBackGuaranteeSectionSchema,
        required: true,
    },
    secureSection: {
        type: secureSectionSchema,
        required: true,
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
