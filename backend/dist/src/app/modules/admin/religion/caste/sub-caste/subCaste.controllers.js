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
exports.deleteSubCaste = exports.updateSubCaste = exports.getSubCasteById = exports.getSubCastesByCaste = exports.getSubCastes = exports.createSubCaste = void 0;
const religion_model_1 = require("../../religion.model");
const caste_model_1 = require("../caste.model");
const subCaste_model_1 = require("./subCaste.model");
const subCaste_validation_1 = require("./subCaste.validation");
// CREATE
const createSubCaste = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = subCaste_validation_1.createSubCasteSchema.parse({
            body: req.body,
        });
        const religion = yield religion_model_1.Religion.findOne({
            _id: validatedData.body.religionId,
            isDeleted: false,
        });
        if (!religion) {
            return res.status(404).json({
                success: false,
                message: "Religion not found.",
            });
        }
        const caste = yield caste_model_1.Caste.findOne({
            _id: validatedData.body.casteId,
            religionId: validatedData.body.religionId,
            isDeleted: false,
        });
        if (!caste) {
            return res.status(404).json({
                success: false,
                message: "Caste not found.",
            });
        }
        const existing = yield subCaste_model_1.SubCaste.findOne({
            casteId: validatedData.body.casteId,
            subCaste: validatedData.body.subCaste,
            isDeleted: false,
        });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Sub-caste already exists.",
            });
        }
        const subCaste = yield subCaste_model_1.SubCaste.create(validatedData.body);
        return res.status(201).json({
            success: true,
            message: "Sub-caste created successfully.",
            data: subCaste,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createSubCaste = createSubCaste;
// GET ALL
const getSubCastes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subCastes = yield subCaste_model_1.SubCaste.find({
            isDeleted: false,
        })
            .populate("religionId", "religion")
            .populate("casteId", "caste");
        return res.status(200).json({
            success: true,
            count: subCastes.length,
            data: subCastes,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getSubCastes = getSubCastes;
// GET BY CASTE
const getSubCastesByCaste = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subCastes = yield subCaste_model_1.SubCaste.find({
            casteId: req.params.casteId,
            isDeleted: false,
        });
        return res.status(200).json({
            success: true,
            count: subCastes.length,
            data: subCastes,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getSubCastesByCaste = getSubCastesByCaste;
// GET BY ID
const getSubCasteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subCaste = yield subCaste_model_1.SubCaste.findOne({
            _id: req.params.id,
            isDeleted: false,
        })
            .populate("religionId", "religion")
            .populate("casteId", "caste");
        if (!subCaste) {
            return res.status(404).json({
                success: false,
                message: "Sub-caste not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: subCaste,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getSubCasteById = getSubCasteById;
// UPDATE
const updateSubCaste = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = subCaste_validation_1.updateSubCasteSchema.parse({
            body: req.body,
        });
        const subCaste = yield subCaste_model_1.SubCaste.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            $set: validatedData.body,
        }, {
            new: true,
            runValidators: true,
        });
        if (!subCaste) {
            return res.status(404).json({
                success: false,
                message: "Sub-caste not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Sub-caste updated successfully.",
            data: subCaste,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateSubCaste = updateSubCaste;
// DELETE
const deleteSubCaste = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subCaste = yield subCaste_model_1.SubCaste.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            isDeleted: true,
        }, {
            new: true,
        });
        if (!subCaste) {
            return res.status(404).json({
                success: false,
                message: "Sub-caste not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Sub-caste deleted successfully.",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteSubCaste = deleteSubCaste;
