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
exports.deleteQualification = exports.updateQualification = exports.getQualificationById = exports.getQualifications = exports.createQualification = void 0;
const qualification_model_1 = require("./qualification.model");
const qualification_validation_1 = require("./qualification.validation");
// CREATE QUALIFICATION
const createQualification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = qualification_validation_1.createQualificationSchema.parse({
            body: req.body,
        });
        const existingQualification = yield qualification_model_1.Qualification.findOne({
            qualification: validatedData.body.qualification,
            educationType: validatedData.body.educationType,
            occupation: validatedData.body.occupation,
            // annualIncome: validatedData.body.annualIncome,
            isDeleted: false,
        });
        if (existingQualification) {
            return res.status(409).json({
                success: false,
                message: "Qualification already exists.",
            });
        }
        const qualification = yield qualification_model_1.Qualification.create(validatedData.body);
        return res.status(201).json({
            success: true,
            message: "Qualification created successfully.",
            data: qualification,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createQualification = createQualification;
// GET ALL QUALIFICATIONS
const getQualifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const qualifications = yield qualification_model_1.Qualification.find({
            isDeleted: false,
        });
        return res.status(200).json({
            success: true,
            count: qualifications.length,
            data: qualifications,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getQualifications = getQualifications;
// GET QUALIFICATION BY ID
const getQualificationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const qualification = yield qualification_model_1.Qualification.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!qualification) {
            return res.status(404).json({
                success: false,
                message: "Qualification not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: qualification,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getQualificationById = getQualificationById;
// UPDATE QUALIFICATION
const updateQualification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = qualification_validation_1.updateQualificationSchema.parse({
            body: req.body,
        });
        const qualification = yield qualification_model_1.Qualification.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            $set: validatedData.body,
        }, {
            new: true,
            runValidators: true,
        });
        if (!qualification) {
            return res.status(404).json({
                success: false,
                message: "Qualification not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Qualification updated successfully.",
            data: qualification,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateQualification = updateQualification;
// DELETE QUALIFICATION (SOFT DELETE)
const deleteQualification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const qualification = yield qualification_model_1.Qualification.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            isDeleted: true,
        }, {
            new: true,
        });
        if (!qualification) {
            return res.status(404).json({
                success: false,
                message: "Qualification not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Qualification deleted successfully.",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteQualification = deleteQualification;
