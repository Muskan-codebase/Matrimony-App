"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromIgnore = exports.getIgnoreById = exports.getMyIgnoredProfiles = exports.addToIgnore = void 0;
const ignore_model_1 = require("./ignore.model");
const profile_model_1 = require("../../profile-details/profile.model");
const shortlist_model_1 = require("../shortlist/shortlist.model");
const profileVisits_model_1 = __importDefault(require("../profile-visits/profileVisits.model"));
const ignore_validation_1 = require("./ignore.validation");
const addToIgnore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ignoredUserId } = ignore_validation_1.createIgnoreSchema.parse(req.body);
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        if (loggedInProfile._id.toString() === ignoredUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot ignore your own profile.",
            });
        }
        const ignoredProfile = yield profile_model_1.Profile.findById(ignoredUserId);
        if (!ignoredProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        const alreadyIgnored = yield ignore_model_1.Ignore.findOne({
            userId: loggedInProfile._id,
            ignoredUserId,
        });
        if (alreadyIgnored) {
            return res.status(409).json({
                success: false,
                message: "Profile already ignored.",
            });
        }
        const ignore = yield ignore_model_1.Ignore.create({
            userId: loggedInProfile._id,
            ignoredUserId,
        });
        // Remove from shortlist if it exists
        yield shortlist_model_1.Shortlist.findOneAndDelete({
            userId: loggedInProfile._id,
            shortlistedUserId: ignoredUserId,
        });
        yield profileVisits_model_1.default.findOneAndDelete({
            userId: loggedInProfile._id,
            visitedProfileId: ignoredUserId,
        });
        return res.status(201).json({
            success: true,
            message: "Profile ignored successfully.",
            data: ignore,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.issues[0].message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.addToIgnore = addToIgnore;
const getMyIgnoredProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        const ignoredProfiles = yield ignore_model_1.Ignore.find({
            userId: loggedInProfile._id,
        }).populate({
            path: "ignoredUserId",
            model: "Profile",
        });
        return res.status(200).json({
            success: true,
            data: ignoredProfiles,
        });
    }
    catch (_a) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getMyIgnoredProfiles = getMyIgnoredProfiles;
const getIgnoreById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = ignore_validation_1.ignoreIdSchema.parse(req.params);
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        const ignore = yield ignore_model_1.Ignore.findOne({
            _id: id,
            userId: loggedInProfile._id,
        }).populate({
            path: "ignoredUserId",
            model: "Profile",
        });
        if (!ignore) {
            return res.status(404).json({
                success: false,
                message: "Ignored profile not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: ignore,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.issues[0].message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getIgnoreById = getIgnoreById;
const removeFromIgnore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = ignore_validation_1.ignoreIdSchema.parse(req.params);
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        const deletedIgnore = yield ignore_model_1.Ignore.findOneAndDelete({
            _id: id,
            userId: loggedInProfile._id,
        });
        if (!deletedIgnore) {
            return res.status(404).json({
                success: false,
                message: "Ignored profile not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Profile removed from ignored list successfully.",
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.issues[0].message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.removeFromIgnore = removeFromIgnore;
