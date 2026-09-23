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
exports.deleteOccupation = exports.updateOccupation = exports.getOccupationById = exports.getOccupations = exports.createOccupation = void 0;
const occupation_model_1 = require("./occupation.model");
const occupation_validation_1 = require("./occupation.validation");
const createOccupation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = occupation_validation_1.createOccupationSchema.parse({
            body: req.body,
        });
        const { occupation } = validatedData.body;
        const existingOccupation = yield occupation_model_1.Occupation.findOne({
            occupation: {
                $regex: new RegExp(`^${occupation}$`, "i"),
            },
            isDeleted: false,
        });
        if (existingOccupation) {
            res.status(409).json({
                success: false,
                message: "Occupation already exists.",
            });
            return;
        }
        const newOccupation = yield occupation_model_1.Occupation.create({
            occupation,
            createdBy: req.user.id,
        });
        res.status(201).json({
            success: true,
            message: "Occupation created successfully.",
            data: newOccupation,
        });
    }
    catch (error) {
        console.error("Create Occupation Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.createOccupation = createOccupation;
const getOccupations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const occupations = yield occupation_model_1.Occupation.find({
            isDeleted: false,
        })
            .sort({ occupation: 1 });
        res.status(200).json({
            success: true,
            message: "Occupations fetched successfully.",
            data: occupations,
        });
    }
    catch (error) {
        console.error("Get Occupations Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.getOccupations = getOccupations;
const getOccupationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const occupation = yield occupation_model_1.Occupation.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!occupation) {
            res.status(404).json({
                success: false,
                message: "Occupation not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Occupation fetched successfully.",
            data: occupation,
        });
    }
    catch (error) {
        console.error("Get Occupation Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.getOccupationById = getOccupationById;
const updateOccupation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { occupation } = req.body;
        const existingOccupation = yield occupation_model_1.Occupation.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!existingOccupation) {
            res.status(404).json({
                success: false,
                message: "Occupation not found.",
            });
            return;
        }
        const duplicateOccupation = yield occupation_model_1.Occupation.findOne({
            occupation: {
                $regex: new RegExp(`^${occupation}$`, "i"),
            },
            _id: { $ne: req.params.id },
            isDeleted: false,
        });
        if (duplicateOccupation) {
            res.status(409).json({
                success: false,
                message: "Occupation already exists.",
            });
            return;
        }
        existingOccupation.occupation = occupation;
        yield existingOccupation.save();
        res.status(200).json({
            success: true,
            message: "Occupation updated successfully.",
            data: existingOccupation,
        });
    }
    catch (error) {
        console.error("Update Occupation Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.updateOccupation = updateOccupation;
const deleteOccupation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const occupation = yield occupation_model_1.Occupation.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!occupation) {
            res.status(404).json({
                success: false,
                message: "Occupation not found.",
            });
            return;
        }
        occupation.isDeleted = true;
        yield occupation.save();
        res.status(200).json({
            success: true,
            message: "Occupation deleted successfully.",
        });
    }
    catch (error) {
        console.error("Delete Occupation Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.deleteOccupation = deleteOccupation;
