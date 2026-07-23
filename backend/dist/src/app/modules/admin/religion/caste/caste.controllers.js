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
exports.deleteCaste = exports.updateCaste = exports.getCasteById = exports.getCastesByReligion = exports.getCastes = exports.createCaste = void 0;
const caste_model_1 = require("./caste.model");
const religion_model_1 = require("../religion.model");
const caste_validation_1 = require("./caste.validation");
// CREATE CASTE
const createCaste = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = caste_validation_1.createCasteSchema.parse({
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
        const existing = yield caste_model_1.Caste.findOne({
            religionId: validatedData.body.religionId,
            caste: validatedData.body.caste,
            isDeleted: false,
        });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Caste already exists.",
            });
        }
        const caste = yield caste_model_1.Caste.create(validatedData.body);
        return res.status(201).json({
            success: true,
            message: "Caste created successfully.",
            data: caste,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createCaste = createCaste;
// GET ALL CASTES
const getCastes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const castes = yield caste_model_1.Caste.find({
            isDeleted: false,
        }).populate("religionId", "religion");
        return res.status(200).json({
            success: true,
            count: castes.length,
            data: castes,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getCastes = getCastes;
// GET CASTES BY RELIGION
const getCastesByReligion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const castes = yield caste_model_1.Caste.find({
            religionId: req.params.religionId,
            isDeleted: false,
        });
        return res.status(200).json({
            success: true,
            count: castes.length,
            data: castes,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getCastesByReligion = getCastesByReligion;
// GET CASTE BY ID
const getCasteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const caste = yield caste_model_1.Caste.findOne({
            _id: req.params.id,
            isDeleted: false,
        }).populate("religionId", "religion");
        if (!caste) {
            return res.status(404).json({
                success: false,
                message: "Caste not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: caste,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getCasteById = getCasteById;
// UPDATE CASTE
const updateCaste = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = caste_validation_1.updateCasteSchema.parse({
            body: req.body,
        });
        const caste = yield caste_model_1.Caste.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            $set: validatedData.body,
        }, {
            new: true,
            runValidators: true,
        });
        if (!caste) {
            return res.status(404).json({
                success: false,
                message: "Caste not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Caste updated successfully.",
            data: caste,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateCaste = updateCaste;
// DELETE CASTE
const deleteCaste = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const caste = yield caste_model_1.Caste.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            isDeleted: true,
        }, {
            new: true,
        });
        if (!caste) {
            return res.status(404).json({
                success: false,
                message: "Caste not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Caste deleted successfully.",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteCaste = deleteCaste;
