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
exports.deleteProfileVisit = exports.getProfileVisitors = exports.getMyVisitedProfiles = exports.createProfileVisit = void 0;
const profileVisits_model_1 = __importDefault(require("./profileVisits.model"));
const profile_model_1 = require("../profile.model");
const profileVisits_validation_1 = require("./profileVisits.validation");
const accountSettings_model_1 = require("../../account-settings/accountSettings.model");
const sendNotification_service_1 = require("../../../services/sendNotification.service");
const createProfileVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const validatedData = profileVisits_validation_1.createProfileVisitSchema.parse(req.body);
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            res.status(404).json({
                success: false,
                message: "Profile not found",
            });
            return;
        }
        if (loggedInProfile._id.toString() ===
            validatedData.visitedProfileId) {
            res.status(400).json({
                success: false,
                message: "You cannot visit your own profile.",
            });
            return;
        }
        const profileExists = yield profile_model_1.Profile.findById(validatedData.visitedProfileId);
        if (!profileExists) {
            res.status(404).json({
                success: false,
                message: "Visited profile not found.",
            });
            return;
        }
        // Check if the profile has already been visited
        const existingVisit = yield profileVisits_model_1.default.findOne({
            viewerProfileId: loggedInProfile._id,
            visitedProfileId: validatedData.visitedProfileId,
        });
        if (existingVisit) {
            // Update the visit time instead of creating a duplicate
            existingVisit.updatedAt = new Date();
            // If you don't have timestamps enabled, use:
            // existingVisit.visitedAt = new Date();
            yield existingVisit.save();
            return res.status(200).json({
                success: true,
                message: "Profile visit updated successfully.",
            });
        }
        // First time visiting this profile
        yield profileVisits_model_1.default.create({
            viewerProfileId: loggedInProfile._id,
            visitedProfileId: validatedData.visitedProfileId,
        });
        const receiverProfile = yield profile_model_1.Profile.findById(validatedData.visitedProfileId);
        if (!receiverProfile) {
            return res.status(404).json({
                success: false,
                message: "Receiver profile not found.",
            });
        }
        // Send notification
        // await sendNotification({
        //     receiverId: receiverProfile.userId.toString(),
        //     title: "New Profile Visit",
        //     body: `${loggedInProfile.basicDetails.firstName} viewed your profile.`,
        //     data: {
        //         type: "profile_visit",
        //         visitorProfileId: loggedInProfile._id.toString(),
        //     },
        // });
        // Check receiver's notification settings
        const accountSettings = yield accountSettings_model_1.AccountSettings.findOne({
            userId: receiverProfile.userId,
            isDeleted: false,
        }).lean();
        // Send Firebase notification only if profile visitor notifications are enabled
        if (((_b = (_a = accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.notificationSettings) === null || _a === void 0 ? void 0 : _a.appNotifications) === null || _b === void 0 ? void 0 : _b.profileVisitors) === true) {
            yield (0, sendNotification_service_1.sendNotification)({
                receiverId: receiverProfile.userId.toString(),
                title: "New Profile Visit",
                body: `${loggedInProfile.basicDetails.firstName} viewed your profile.`,
                data: {
                    type: "profile_visit",
                    visitorProfileId: loggedInProfile._id.toString(),
                },
            });
        }
        return res.status(201).json({
            success: true,
            message: "Profile visit recorded successfully.",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createProfileVisit = createProfileVisit;
const getMyVisitedProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            res.status(404).json({
                success: false,
                message: "Profile not found",
            });
            return;
        }
        const visits = yield profileVisits_model_1.default.find({
            viewerProfileId: loggedInProfile._id,
        })
            .populate({
            path: "visitedProfileId",
            model: "Profile",
        })
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: visits,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getMyVisitedProfiles = getMyVisitedProfiles;
const getProfileVisitors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            res.status(404).json({
                success: false,
                message: "Profile not found",
            });
            return;
        }
        const visitors = yield profileVisits_model_1.default.find({
            visitedProfileId: loggedInProfile._id,
        })
            .populate({
            path: "viewerProfileId",
            model: "Profile",
        })
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: visitors,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getProfileVisitors = getProfileVisitors;
const deleteProfileVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            res.status(404).json({
                success: false,
                message: "Profile not found",
            });
            return;
        }
        const visit = yield profileVisits_model_1.default.findOneAndDelete({
            _id: req.params.id,
            viewerProfileId: loggedInProfile._id,
        });
        if (!visit) {
            res.status(404).json({
                success: false,
                message: "Profile visit not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Profile visit deleted successfully.",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteProfileVisit = deleteProfileVisit;
