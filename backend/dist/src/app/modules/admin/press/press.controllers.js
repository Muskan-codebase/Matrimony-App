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
exports.deletePress = exports.updatePress = exports.getPressById = exports.getPress = exports.createPress = void 0;
const press_validation_1 = require("./press.validation");
const mongoose_1 = __importDefault(require("mongoose"));
const press_model_1 = require("./press.model");
const createPress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Press image is required",
            });
        }
        const validationResult = press_validation_1.createPressSchema.safeParse(Object.assign(Object.assign({}, req.body), { image }));
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }
        const press = yield press_model_1.Press.create(validationResult.data);
        return res.status(201).json({
            success: true,
            message: "Press article created successfully",
            data: press,
        });
    }
    catch (error) {
        console.error("Create Press Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create press article",
        });
    }
});
exports.createPress = createPress;
const getPress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const press = yield press_model_1.Press.find()
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json({
            success: true,
            message: "Press articles fetched successfully",
            data: press,
        });
    }
    catch (error) {
        console.error("Get Press Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch press articles",
        });
    }
});
exports.getPress = getPress;
const getPressById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid press article ID",
            });
        }
        const press = yield press_model_1.Press.findById(id).lean();
        if (!press) {
            return res.status(404).json({
                success: false,
                message: "Press article not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Press article fetched successfully",
            data: press,
        });
    }
    catch (error) {
        console.error("Get Press By ID Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch press article",
        });
    }
});
exports.getPressById = getPressById;
const updatePress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid press article ID",
            });
        }
        const validationResult = press_validation_1.updatePressSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }
        const updateData = Object.assign(Object.assign({}, validationResult.data), (((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) && {
            image: req.file.path,
        }));
        const press = yield press_model_1.Press.findByIdAndUpdate(id, {
            $set: updateData,
        }, {
            new: true,
            runValidators: true,
        });
        if (!press) {
            return res.status(404).json({
                success: false,
                message: "Press article not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Press article updated successfully",
            data: press,
        });
    }
    catch (error) {
        console.error("Update Press Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update press article",
        });
    }
});
exports.updatePress = updatePress;
const deletePress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid press article ID",
            });
        }
        const press = yield press_model_1.Press.findByIdAndDelete(id);
        if (!press) {
            return res.status(404).json({
                success: false,
                message: "Press article not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Press article deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Press Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete press article",
        });
    }
});
exports.deletePress = deletePress;
