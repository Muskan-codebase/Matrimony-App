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
exports.deletePackage = exports.updatePackage = exports.getPackageById = exports.getPackages = exports.createPackage = void 0;
const package_model_1 = __importDefault(require("./package.model"));
const package_validation_1 = require("./package.validation");
const createPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = package_validation_1.createPackageSchema.parse(req.body);
        const existingPackage = yield package_model_1.default.findOne({
            title: validatedData.title,
        });
        if (existingPackage) {
            res.status(400).json({
                success: false,
                message: "Package already exists.",
            });
            return;
        }
        const newPackage = yield package_model_1.default.create(validatedData);
        res.status(201).json({
            success: true,
            message: "Package created successfully.",
            data: newPackage,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createPackage = createPackage;
const getPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const packages = yield package_model_1.default.find({
            isDeleted: false,
        }).sort({
            displayOrder: 1,
        });
        res.status(200).json({
            success: true,
            data: packages,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getPackages = getPackages;
const getPackageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const packageData = yield package_model_1.default.findById(req.params.id);
        if (!packageData) {
            res.status(404).json({
                success: false,
                message: "Package not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: packageData,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getPackageById = getPackageById;
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = package_validation_1.updatePackageSchema.parse(req.body);
        const packageData = yield package_model_1.default.findById(req.params.id);
        if (!packageData) {
            res.status(404).json({
                success: false,
                message: "Package not found.",
            });
            return;
        }
        const updatedPackage = yield package_model_1.default.findByIdAndUpdate(req.params.id, validatedData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            message: "Package updated successfully.",
            data: updatedPackage,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updatePackage = updatePackage;
const deletePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const packageData = yield package_model_1.default.findById(req.params.id);
        if (!packageData) {
            res.status(404).json({
                success: false,
                message: "Package not found.",
            });
            return;
        }
        packageData.isDeleted = true;
        yield packageData.save();
        res.status(200).json({
            success: true,
            message: "Package deleted successfully.",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deletePackage = deletePackage;
