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
exports.deleteMotherTongue = exports.updateMotherTongue = exports.getMotherTongueById = exports.getMotherTongues = exports.createMotherTongue = void 0;
const motherTongue_model_1 = require("./motherTongue.model");
const createMotherTongue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { motherTongue } = req.body;
        const exists = yield motherTongue_model_1.MotherTongue.findOne({
            motherTongue,
            isDeleted: false,
        });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Mother tongue already exists.",
            });
        }
        const newMotherTongue = yield motherTongue_model_1.MotherTongue.create({
            motherTongue,
        });
        return res.status(201).json({
            success: true,
            message: "Mother tongue created successfully.",
            data: newMotherTongue,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
});
exports.createMotherTongue = createMotherTongue;
const getMotherTongues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const motherTongues = yield motherTongue_model_1.MotherTongue.find({
            isDeleted: false,
        }).sort({
            motherTongue: 1,
        });
        return res.status(200).json({
            success: true,
            data: motherTongues,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
});
exports.getMotherTongues = getMotherTongues;
const getMotherTongueById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const motherTongue = yield motherTongue_model_1.MotherTongue.findOne({
            _id: id,
            isDeleted: false,
        });
        if (!motherTongue) {
            return res.status(404).json({
                success: false,
                message: "Mother tongue not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: motherTongue,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
});
exports.getMotherTongueById = getMotherTongueById;
const updateMotherTongue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { motherTongue } = req.body;
        if (motherTongue) {
            const exists = yield motherTongue_model_1.MotherTongue.findOne({
                motherTongue,
                isDeleted: false,
                _id: { $ne: id },
            });
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: "Mother tongue already exists.",
                });
            }
        }
        const updatedMotherTongue = yield motherTongue_model_1.MotherTongue.findOneAndUpdate({
            _id: id,
            isDeleted: false,
        }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedMotherTongue) {
            return res.status(404).json({
                success: false,
                message: "Mother tongue not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Mother tongue updated successfully.",
            data: updatedMotherTongue,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
});
exports.updateMotherTongue = updateMotherTongue;
const deleteMotherTongue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedMotherTongue = yield motherTongue_model_1.MotherTongue.findOneAndUpdate({
            _id: id,
            isDeleted: false,
        }, {
            isDeleted: true,
        }, {
            new: true,
        });
        if (!deletedMotherTongue) {
            return res.status(404).json({
                success: false,
                message: "Mother tongue not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Mother tongue deleted successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
});
exports.deleteMotherTongue = deleteMotherTongue;
