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
exports.deleteExperience = exports.updateExperience = exports.getExperienceById = exports.getExperiences = exports.createExperience = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const experience_model_1 = __importDefault(require("./experience.model"));
const experience_validation_1 = require("./experience.validation");
// POST - Create Experience
const createExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = experience_validation_1.createExperienceSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }
        const experience = yield experience_model_1.default.create(validationResult.data);
        return res.status(201).json({
            success: true,
            message: "Experience created successfully",
            data: experience,
        });
    }
    catch (error) {
        console.error("Create Experience Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create experience",
            error: error.message,
        });
    }
});
exports.createExperience = createExperience;
// GET - Get All Experiences
const getExperiences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experiences = yield experience_model_1.default.find()
            .sort({ sortOrder: 1, createdAt: -1 })
            .lean();
        return res.status(200).json({
            success: true,
            message: "Experiences fetched successfully",
            count: experiences.length,
            data: experiences,
        });
    }
    catch (error) {
        console.error("Get Experiences Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch experiences",
            error: error.message,
        });
    }
});
exports.getExperiences = getExperiences;
// GET BY ID - Get Single Experience
const getExperienceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID",
            });
        }
        const experience = yield experience_model_1.default.findById(id);
        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Experience fetched successfully",
            data: experience,
        });
    }
    catch (error) {
        console.error("Get Experience By ID Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch experience",
            error: error.message,
        });
    }
});
exports.getExperienceById = getExperienceById;
// PUT BY ID - Update Experience
const updateExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID",
            });
        }
        const validationResult = experience_validation_1.updateExperienceSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }
        const experience = yield experience_model_1.default.findByIdAndUpdate(id, validationResult.data, {
            new: true,
            runValidators: true,
        });
        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Experience updated successfully",
            data: experience,
        });
    }
    catch (error) {
        console.error("Update Experience Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update experience",
            error: error.message,
        });
    }
});
exports.updateExperience = updateExperience;
// DELETE BY ID - Delete Experience
const deleteExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID",
            });
        }
        const experience = yield experience_model_1.default.findByIdAndDelete(id);
        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Experience deleted successfully",
            data: experience,
        });
    }
    catch (error) {
        console.error("Delete Experience Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete experience",
            error: error.message,
        });
    }
});
exports.deleteExperience = deleteExperience;
