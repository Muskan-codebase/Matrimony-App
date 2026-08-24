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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.getProfileById = exports.getAllProfiles = exports.updateProfile = exports.addProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const profile_model_1 = require("../../profile-details/profile.model");
const profile_validation_1 = require("../../profile-details/profile.validation");
const profile_controllers_1 = require("../../profile-details/profile.controllers");
const addProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let profileBody;
        try {
            profileBody =
                typeof req.body.data === "string"
                    ? JSON.parse(req.body.data)
                    : req.body.data;
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON data.",
            });
        }
        const validation = profile_validation_1.createProfileSchema.safeParse({
            body: profileBody,
        });
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten(),
            });
        }
        const _a = validation.data.body, { basicDetails } = _a, profileData = __rest(_a, ["basicDetails"]);
        if (!basicDetails) {
            return res.status(400).json({
                success: false,
                message: "Basic details are required to create a profile.",
            });
        }
        const matrimonyId = (0, profile_controllers_1.generateMatrimonyId)(basicDetails.firstName, basicDetails.lastName, basicDetails.dob);
        const photos = (req.files || [])
            .map((file) => file.path);
        const profile = yield profile_model_1.Profile.create(Object.assign(Object.assign({ userId: req.user.id, matrimonyId,
            basicDetails }, profileData), { photos }));
        return res.status(201).json({
            success: true,
            message: "Profile added successfully",
            data: profile,
        });
    }
    catch (error) {
        console.error("Add Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add profile",
            error: error.message,
        });
    }
});
exports.addProfile = addProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile ID",
            });
        }
        const validation = profile_validation_1.updateProfileSchema.safeParse({
            body: req.body
        });
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten(),
            });
        }
        const uploadedPhotos = (req.files || [])
            .map((file) => file.path);
        const updateData = Object.assign({}, validation.data.body);
        if (uploadedPhotos.length > 0) {
            updateData.photos = uploadedPhotos;
        }
        const profile = yield profile_model_1.Profile.findOneAndUpdate({
            _id: id,
            isDeleted: false,
        }, {
            $set: updateData,
        }, {
            new: true,
            runValidators: true,
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profile,
        });
    }
    catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
});
exports.updateProfile = updateProfile;
const getAllProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [profiles, totalProfiles] = yield Promise.all([
            profile_model_1.Profile.find({
                isDeleted: false,
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            profile_model_1.Profile.countDocuments({
                isDeleted: false,
            }),
        ]);
        return res.status(200).json({
            success: true,
            message: "Profiles fetched successfully",
            data: profiles,
            pagination: {
                currentPage: page,
                limit,
                totalProfiles,
                totalPages: Math.ceil(totalProfiles / limit),
            },
        });
    }
    catch (error) {
        console.error("Get All Profiles Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profiles",
            error: error.message,
        });
    }
});
exports.getAllProfiles = getAllProfiles;
const getProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile ID",
            });
        }
        const profile = yield profile_model_1.Profile.findOne({
            _id: id,
            isDeleted: false,
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: profile,
        });
    }
    catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
});
exports.getProfileById = getProfileById;
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile ID",
            });
        }
        const profile = yield profile_model_1.Profile.findOneAndUpdate({
            _id: id,
            isDeleted: false,
        }, {
            $set: {
                isDeleted: true,
            },
        }, {
            new: true,
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete profile",
            error: error.message,
        });
    }
});
exports.deleteProfile = deleteProfile;
