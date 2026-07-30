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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromShortlist = exports.getShortlistById = exports.getUsersWhoShortlistedMe = exports.getMyShortlistedProfiles = exports.addToShortlist = void 0;
const shortlist_model_1 = require("./shortlist.model");
const profile_model_1 = require("../profile.model");
const shortlist_validation_1 = require("./shortlist.validation");
const addToShortlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shortlistedUserId } = shortlist_validation_1.createShortlistSchema.parse(req.body);
        // Find logged-in user's profile
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        // Prevent self-shortlisting
        if (loggedInProfile._id.toString() === shortlistedUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot shortlist your own profile.",
            });
        }
        // Check if shortlisted profile exists
        const profile = yield profile_model_1.Profile.findById(shortlistedUserId);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        // Prevent duplicate shortlist
        const alreadyShortlisted = yield shortlist_model_1.Shortlist.findOne({
            userId: loggedInProfile._id,
            shortlistedUserId,
        });
        if (alreadyShortlisted) {
            return res.status(409).json({
                success: false,
                message: "Profile already shortlisted.",
            });
        }
        const shortlist = yield shortlist_model_1.Shortlist.create({
            userId: loggedInProfile._id,
            shortlistedUserId,
        });
        const populatedShortlist = yield shortlist_model_1.Shortlist.findById(shortlist._id)
            .populate({
            path: "shortlistedUserId",
            model: "Profile",
        });
        return res.status(201).json({
            success: true,
            message: "Profile shortlisted successfully.",
            data: populatedShortlist,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.addToShortlist = addToShortlist;
const getMyShortlistedProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const shortlistedProfiles = yield shortlist_model_1.Shortlist.find({
            userId: loggedInProfile._id,
        }).populate({
            path: "shortlistedUserId",
            model: "Profile",
        });
        return res.status(200).json({
            success: true,
            data: shortlistedProfiles,
        });
    }
    catch (_a) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getMyShortlistedProfiles = getMyShortlistedProfiles;
const getUsersWhoShortlistedMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find logged-in user's profile
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        // Find everyone who shortlisted this profile
        const shortlistedBy = yield shortlist_model_1.Shortlist.find({
            shortlistedUserId: loggedInProfile._id,
        }).populate({
            path: "userId",
            model: "Profile",
        });
        return res.status(200).json({
            success: true,
            data: shortlistedBy,
        });
    }
    catch (_a) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getUsersWhoShortlistedMe = getUsersWhoShortlistedMe;
const getShortlistById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = shortlist_validation_1.shortlistIdSchema.parse(req.params);
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        const shortlist = yield shortlist_model_1.Shortlist.findOne({
            _id: id,
            userId: loggedInProfile._id,
        }).populate({
            path: "shortlistedUserId",
            model: "Profile",
        });
        if (!shortlist) {
            return res.status(404).json({
                success: false,
                message: "Shortlist not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: shortlist,
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.issues[0].message,
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getShortlistById = getShortlistById;
const removeFromShortlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = shortlist_validation_1.shortlistIdSchema.parse(req.params);
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        const deleted = yield shortlist_model_1.Shortlist.findOneAndDelete({
            _id: id,
            userId: loggedInProfile._id,
        });
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Shortlist not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Profile removed from shortlist successfully.",
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.removeFromShortlist = removeFromShortlist;
