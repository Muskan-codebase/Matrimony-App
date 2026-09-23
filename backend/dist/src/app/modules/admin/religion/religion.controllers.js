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
exports.deleteReligion = exports.updateReligion = exports.getReligionById = exports.getReligions = exports.createReligion = void 0;
const religion_model_1 = require("./religion.model");
const religion_validation_1 = require("./religion.validation");
const createReligion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = religion_validation_1.createReligionSchema.parse({
            body: req.body,
        });
        const existingReligion = yield religion_model_1.Religion.findOne({
            religion: validatedData.body.religion,
            isDeleted: false,
        });
        if (existingReligion) {
            return res.status(409).json({
                success: false,
                message: "Religion already exists.",
            });
        }
        const religion = yield religion_model_1.Religion.create({
            religion: validatedData.body.religion,
        });
        return res.status(201).json({
            success: true,
            message: "Religion created successfully.",
            data: religion,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createReligion = createReligion;
const getReligions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const religions = yield religion_model_1.Religion.find({
            isDeleted: false,
        }).sort({
            religion: 1,
        });
        return res.status(200).json({
            success: true,
            count: religions.length,
            data: religions,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getReligions = getReligions;
const getReligionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const religion = yield religion_model_1.Religion.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!religion) {
            return res.status(404).json({
                success: false,
                message: "Religion not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: religion,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getReligionById = getReligionById;
const updateReligion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = religion_validation_1.updateReligionSchema.parse({
            body: req.body,
        });
        if (validatedData.body.religion) {
            const existingReligion = yield religion_model_1.Religion.findOne({
                religion: validatedData.body.religion,
                _id: {
                    $ne: req.params.id,
                },
                isDeleted: false,
            });
            if (existingReligion) {
                return res.status(409).json({
                    success: false,
                    message: "Religion already exists.",
                });
            }
        }
        const religion = yield religion_model_1.Religion.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            $set: validatedData.body,
        }, {
            new: true,
            runValidators: true,
        });
        if (!religion) {
            return res.status(404).json({
                success: false,
                message: "Religion not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Religion updated successfully.",
            data: religion,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateReligion = updateReligion;
const deleteReligion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const religion = yield religion_model_1.Religion.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            isDeleted: true,
        }, {
            new: true,
        });
        if (!religion) {
            return res.status(404).json({
                success: false,
                message: "Religion not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Religion deleted successfully.",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteReligion = deleteReligion;
