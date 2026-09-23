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
exports.unblockProfile = exports.getBlockedProfileById = exports.getMyBlockedProfiles = exports.blockProfile = void 0;
const block_model_1 = require("./block.model");
const profile_model_1 = require("../profile.model");
const block_validation_1 = require("./block.validation");
const blockProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blockedUserId } = block_validation_1.createBlockSchema.parse(req.body);
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        if (loggedInProfile._id.toString() === blockedUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot block your own profile.",
            });
        }
        const blockedProfile = yield profile_model_1.Profile.findById(blockedUserId);
        if (!blockedProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        const alreadyBlocked = yield block_model_1.Block.findOne({
            userId: loggedInProfile._id,
            blockedUserId,
        });
        if (alreadyBlocked) {
            return res.status(409).json({
                success: false,
                message: "Profile already blocked.",
            });
        }
        const block = yield block_model_1.Block.create({
            userId: loggedInProfile._id,
            blockedUserId,
        });
        return res.status(201).json({
            success: true,
            message: "Profile blocked successfully.",
            data: block,
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
exports.blockProfile = blockProfile;
const getMyBlockedProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const blockedProfiles = yield block_model_1.Block.find({
            userId: loggedInProfile._id,
        }).populate({
            path: "blockedUserId",
            model: "Profile",
        });
        return res.status(200).json({
            success: true,
            data: blockedProfiles,
        });
    }
    catch (_a) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getMyBlockedProfiles = getMyBlockedProfiles;
const getBlockedProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = block_validation_1.blockIdSchema.parse(req.params);
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        const block = yield block_model_1.Block.findOne({
            _id: id,
            userId: loggedInProfile._id,
        }).populate({
            path: "blockedUserId",
            model: "Profile",
        });
        if (!block) {
            return res.status(404).json({
                success: false,
                message: "Blocked profile not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: block,
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
exports.getBlockedProfileById = getBlockedProfileById;
const unblockProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = block_validation_1.blockIdSchema.parse(req.params);
        const loggedInProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        });
        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }
        const deletedBlock = yield block_model_1.Block.findOneAndDelete({
            _id: id,
            userId: loggedInProfile._id,
        });
        if (!deletedBlock) {
            return res.status(404).json({
                success: false,
                message: "Blocked profile not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Profile unblocked successfully.",
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
exports.unblockProfile = unblockProfile;
