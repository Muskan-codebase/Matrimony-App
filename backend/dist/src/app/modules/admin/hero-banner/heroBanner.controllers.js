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
exports.deleteBanner = exports.getBanner = exports.getBanners = exports.updateBanner = exports.createBanner = void 0;
const heroBanner_model_1 = require("./heroBanner.model");
const heroBanner_validation_1 = require("./heroBanner.validation");
const createBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!image) {
            res.status(400).json({
                success: false,
                message: "Banner image is required.",
            });
            return;
        }
        const validatedData = heroBanner_validation_1.createBannerSchema.parse(Object.assign(Object.assign({}, req.body), { image, displayOrder: req.body.displayOrder
                ? Number(req.body.displayOrder)
                : undefined, isActive: req.body.isActive !== undefined
                ? req.body.isActive === "true"
                : undefined }));
        const banner = yield heroBanner_model_1.Banner.create(validatedData);
        res.status(201).json({
            success: true,
            message: "Banner created successfully.",
            data: banner,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: error.errors,
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.createBanner = createBanner;
const updateBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingBanner = yield heroBanner_model_1.Banner.findOne({
            _id: id,
            isDeleted: false,
        });
        if (!existingBanner) {
            res.status(404).json({
                success: false,
                message: "Banner not found.",
            });
            return;
        }
        const updatedData = Object.assign({}, req.body);
        // Update image only if a new file is uploaded
        if (req.file) {
            updatedData.image = req.file.path;
        }
        // Convert multipart/form-data string values
        if (updatedData.displayOrder !== undefined) {
            updatedData.displayOrder = Number(updatedData.displayOrder);
        }
        if (updatedData.isActive !== undefined) {
            updatedData.isActive = updatedData.isActive === "true";
        }
        const validatedData = heroBanner_validation_1.updateBannerSchema.parse(updatedData);
        const banner = yield heroBanner_model_1.Banner.findByIdAndUpdate(id, validatedData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            message: "Banner updated successfully.",
            data: banner,
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: error.errors,
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.updateBanner = updateBanner;
const getBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banners = yield heroBanner_model_1.Banner.find();
        if (!banners) {
            res.status(400).json({
                success: false,
                message: "No banners found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Banners fetched successfully",
            data: banners
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: error.errors,
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.getBanners = getBanners;
const getBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params;
        const banner = yield heroBanner_model_1.Banner.findById(id);
        if (!banner) {
            res.status(400).json({
                success: false,
                message: "Banner not found!"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Banner fetched successfully",
            data: banner
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: error.errors,
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.getBanner = getBanner;
const deleteBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const banner = yield heroBanner_model_1.Banner.findOneAndUpdate({
            _id: id,
            isDeleted: false,
        }, {
            isDeleted: true,
        }, {
            new: true,
        });
        if (!banner) {
            res.status(404).json({
                success: false,
                message: "Banner not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Banner deleted successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.deleteBanner = deleteBanner;
