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
exports.deleteFAQ = exports.updateFAQ = exports.getFAQById = exports.getFAQs = exports.createFAQ = void 0;
const faq_model_1 = require("./faq.model");
const faq_validation_1 = require("./faq.validation");
const createFAQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = faq_validation_1.createFAQSchema.parse(req.body);
        const faq = yield faq_model_1.FAQ.create(validatedData);
        res.status(201).json({
            success: true,
            message: "FAQ created successfully.",
            data: faq,
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
            error,
        });
    }
});
exports.createFAQ = createFAQ;
const getFAQs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faqs = yield faq_model_1.FAQ.find({
            isDeleted: false,
            isActive: true,
        }).sort({ displayOrder: 1 });
        res.status(200).json({
            success: true,
            data: faqs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
});
exports.getFAQs = getFAQs;
const getFAQById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faq = yield faq_model_1.FAQ.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!faq) {
            res.status(404).json({
                success: false,
                message: "FAQ not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: faq,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
});
exports.getFAQById = getFAQById;
const updateFAQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = faq_validation_1.updateFAQSchema.parse(req.body);
        const faq = yield faq_model_1.FAQ.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, validatedData, {
            new: true,
            runValidators: true,
        });
        if (!faq) {
            res.status(404).json({
                success: false,
                message: "FAQ not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "FAQ updated successfully.",
            data: faq,
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
            error,
        });
    }
});
exports.updateFAQ = updateFAQ;
const deleteFAQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faq = yield faq_model_1.FAQ.findByIdAndUpdate(req.params.id, {
            isDeleted: true,
        }, {
            new: true,
        });
        if (!faq) {
            res.status(404).json({
                success: false,
                message: "FAQ not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "FAQ deleted successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
});
exports.deleteFAQ = deleteFAQ;
