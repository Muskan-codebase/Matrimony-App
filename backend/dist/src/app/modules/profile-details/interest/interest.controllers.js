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
exports.withdrawInterest = exports.rejectInterest = exports.acceptInterest = exports.getReceivedInterests = exports.getSentInterests = exports.sendInterest = void 0;
const interest_model_1 = require("./interest.model");
const profile_model_1 = require("../profile.model");
const shortlist_model_1 = require("../shortlist/shortlist.model");
const profileVisits_model_1 = __importDefault(require("../profile-visits/profileVisits.model"));
const interest_validation_1 = require("./interest.validation");
const sendNotification_service_1 = require("../../../services/sendNotification.service");
const sendInterest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = interest_validation_1.createInterestSchema.parse({
            body: req.body,
        });
        // Get sender profile
        const senderProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (!senderProfile) {
            return res.status(404).json({
                success: false,
                message: "Sender profile not found.",
            });
        }
        // Cannot send interest to yourself
        if (senderProfile._id.toString() === validatedData.body.receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send interest to yourself.",
            });
        }
        // Check duplicate interest
        const existingInterest = yield interest_model_1.Interest.findOne({
            senderId: senderProfile._id,
            receiverId: validatedData.body.receiverId,
            isDeleted: false,
        });
        if (existingInterest) {
            return res.status(409).json({
                success: false,
                message: "Interest already sent.",
            });
        }
        // Create interest
        const interest = yield interest_model_1.Interest.create({
            senderId: senderProfile._id,
            receiverId: validatedData.body.receiverId,
        });
        const receiverProfile = yield profile_model_1.Profile.findById(validatedData.body.receiverId);
        if (!receiverProfile) {
            return res.status(404).json({
                success: false,
                message: "Receiver profile not found.",
            });
        }
        // Remove profile from shortlist if it exists
        yield shortlist_model_1.Shortlist.findOneAndDelete({
            userId: senderProfile._id,
            shortlistedUserId: validatedData.body.receiverId,
        });
        yield profileVisits_model_1.default.findOneAndDelete({
            viewerProfileId: senderProfile._id,
            visitedProfileId: validatedData.body.receiverId,
        });
        // Populate sender & receiver
        const populatedInterest = yield interest_model_1.Interest.findById(interest._id)
            .populate("senderId")
            .populate("receiverId");
        // Send notification
        yield (0, sendNotification_service_1.sendNotification)({
            receiverId: receiverProfile.userId.toString(),
            title: "New Interest Request",
            body: `${senderProfile.basicDetails.firstName} sent you an interest request.`,
            data: {
                type: "interest",
                interestId: interest.id.toString(),
            },
        });
        return res.status(201).json({
            success: true,
            message: "Interest sent successfully.",
            data: populatedInterest,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.sendInterest = sendInterest;
const getSentInterests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const senderProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (!senderProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        const interests = yield interest_model_1.Interest.find({
            senderId: senderProfile._id,
            isDeleted: false,
        }).populate("senderId")
            .populate("receiverId");
        return res.status(200).json({
            success: true,
            count: interests.length,
            data: interests,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getSentInterests = getSentInterests;
const getReceivedInterests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiverProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (!receiverProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        const interests = yield interest_model_1.Interest.find({
            receiverId: receiverProfile._id,
            isDeleted: false,
        })
            .populate("senderId")
            .populate("receiverId");
        return res.status(200).json({
            success: true,
            count: interests.length,
            data: interests,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getReceivedInterests = getReceivedInterests;
const acceptInterest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find logged-in user's profile
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        // Accept the interest
        const interest = yield interest_model_1.Interest.findOneAndUpdate({
            _id: req.params.id,
            receiverId: loggedInProfile._id,
            status: "Pending",
            isDeleted: false,
        }, {
            $set: {
                status: "Accepted",
            },
        }, {
            new: true,
        })
            .populate("senderId")
            .populate("receiverId");
        if (!interest) {
            return res.status(404).json({
                success: false,
                message: "Interest not found.",
            });
        }
        const senderProfile = yield profile_model_1.Profile.findById(interest.senderId);
        if (!senderProfile) {
            return res.status(404).json({
                success: false,
                message: "Sender profile not found.",
            });
        }
        yield (0, sendNotification_service_1.sendNotification)({
            receiverId: senderProfile.userId.toString(),
            title: "Interest Accepted",
            body: `${loggedInProfile.basicDetails.firstName} accepted your interest request.`,
            data: {
                type: "interest_accepted",
                interestId: interest.id,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Interest accepted successfully.",
            data: interest,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.acceptInterest = acceptInterest;
const rejectInterest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiverProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (!receiverProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        const interest = yield interest_model_1.Interest.findOneAndUpdate({
            _id: req.params.id,
            receiverId: receiverProfile._id,
            status: "Pending",
            isDeleted: false,
        }, {
            status: "Rejected",
        }, {
            new: true,
        })
            .populate("senderId")
            .populate("receiverId");
        if (!interest) {
            return res.status(404).json({
                success: false,
                message: "Interest not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Interest rejected successfully.",
            data: interest,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.rejectInterest = rejectInterest;
const withdrawInterest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const senderProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });
        if (!senderProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        const interest = yield interest_model_1.Interest.findOneAndUpdate({
            _id: req.params.id,
            senderId: senderProfile._id,
            status: "Pending",
            isDeleted: false,
        }, {
            status: "Withdrawn",
        }, {
            new: true,
        })
            .populate("senderId")
            .populate("receiverId");
        if (!interest) {
            return res.status(404).json({
                success: false,
                message: "Interest not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Interest withdrawn successfully.",
            data: interest,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.withdrawInterest = withdrawInterest;
