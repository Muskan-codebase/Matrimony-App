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
exports.deleteOnlinePersonalTip = exports.updateOnlinePersonalTip = exports.getOnlinePersonalTipById = exports.getOnlinePersonalTips = exports.createOnlinePersonalTip = void 0;
const tips_model_1 = require("./tips.model");
const tips_validation_1 = require("./tips.validation");
const createOnlinePersonalTip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!image) {
            res.status(400).json({
                success: false,
                message: 'Image is required.',
            });
            return;
        }
        const validatedData = tips_validation_1.createOnlinePersonalTipSchema.parse(Object.assign(Object.assign({}, req.body), { image, displayOrder: req.body.displayOrder
                ? Number(req.body.displayOrder)
                : undefined, isActive: req.body.isActive !== undefined
                ? req.body.isActive === 'true'
                : undefined }));
        const tip = yield tips_model_1.OnlinePersonalTip.create(validatedData);
        res.status(201).json({
            success: true,
            message: 'Online Personal Tip created successfully.',
            data: tip,
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors: error.errors,
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});
exports.createOnlinePersonalTip = createOnlinePersonalTip;
const getOnlinePersonalTips = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tips = yield tips_model_1.OnlinePersonalTip.find({ isDeleted: false }).sort({
            displayOrder: 1,
        });
        res.status(200).json({
            success: true,
            message: 'Online Personal Tips fetched successfully.',
            data: tips,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});
exports.getOnlinePersonalTips = getOnlinePersonalTips;
const getOnlinePersonalTipById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tip = yield tips_model_1.OnlinePersonalTip.findOne({ _id: id, isDeleted: false });
        if (!tip) {
            res.status(404).json({
                success: false,
                message: 'Online Personal Tip not found.',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Online Personal Tip fetched successfully.',
            data: tip,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});
exports.getOnlinePersonalTipById = getOnlinePersonalTipById;
const updateOnlinePersonalTip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingTip = yield tips_model_1.OnlinePersonalTip.findOne({
            _id: id,
            isDeleted: false,
        });
        if (!existingTip) {
            res.status(404).json({
                success: false,
                message: 'Online Personal Tip not found.',
            });
            return;
        }
        const updatedData = Object.assign({}, req.body);
        // Update image only if a new file is uploaded
        if (req.file) {
            updatedData.image = req.file.path;
        }
        // multipart/form-data sends everything as strings — coerce before Zod sees it
        if (updatedData.displayOrder !== undefined) {
            updatedData.displayOrder = Number(updatedData.displayOrder);
        }
        if (updatedData.isActive !== undefined) {
            updatedData.isActive = updatedData.isActive === 'true';
        }
        const validatedData = tips_validation_1.updateOnlinePersonalTipSchema.parse(updatedData);
        const tip = yield tips_model_1.OnlinePersonalTip.findByIdAndUpdate(id, validatedData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            message: 'Online Personal Tip updated successfully.',
            data: tip,
        });
    }
    catch (error) {
        if (error.name === 'ZodError' || error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors: error.errors,
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});
exports.updateOnlinePersonalTip = updateOnlinePersonalTip;
const deleteOnlinePersonalTip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tip = yield tips_model_1.OnlinePersonalTip.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!tip) {
            res.status(404).json({
                success: false,
                message: 'Online Personal Tip not found.',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Online Personal Tip deleted successfully.',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});
exports.deleteOnlinePersonalTip = deleteOnlinePersonalTip;
