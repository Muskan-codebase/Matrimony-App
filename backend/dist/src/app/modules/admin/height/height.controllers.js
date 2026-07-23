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
exports.deleteHeight = exports.updateHeight = exports.getHeightById = exports.getHeights = exports.createHeight = void 0;
const height_model_1 = require("./height.model");
const height_validation_1 = require("./height.validation");
// CREATE HEIGHT
const createHeight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = height_validation_1.createHeightSchema.parse({
            body: req.body,
        });
        const existingHeight = yield height_model_1.Height.findOne({
            height: validatedData.body.height,
            isDeleted: false,
        });
        if (existingHeight) {
            return res.status(409).json({
                success: false,
                message: "Height already exists.",
            });
        }
        const height = yield height_model_1.Height.create(validatedData.body);
        return res.status(201).json({
            success: true,
            message: "Height created successfully.",
            data: height,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createHeight = createHeight;
// GET ALL HEIGHTS
const getHeights = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const heights = yield height_model_1.Height.find({
            isDeleted: false,
        });
        return res.status(200).json({
            success: true,
            count: heights.length,
            data: heights,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getHeights = getHeights;
// GET HEIGHT BY ID
const getHeightById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const height = yield height_model_1.Height.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!height) {
            return res.status(404).json({
                success: false,
                message: "Height not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: height,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getHeightById = getHeightById;
// UPDATE HEIGHT
const updateHeight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = height_validation_1.updateHeightSchema.parse({
            body: req.body,
        });
        const height = yield height_model_1.Height.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            $set: validatedData.body,
        }, {
            new: true,
            runValidators: true,
        });
        if (!height) {
            return res.status(404).json({
                success: false,
                message: "Height not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Height updated successfully.",
            data: height,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateHeight = updateHeight;
// SOFT DELETE HEIGHT
const deleteHeight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const height = yield height_model_1.Height.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            isDeleted: true,
        }, {
            new: true,
        });
        if (!height) {
            return res.status(404).json({
                success: false,
                message: "Height not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Height deleted successfully.",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteHeight = deleteHeight;
