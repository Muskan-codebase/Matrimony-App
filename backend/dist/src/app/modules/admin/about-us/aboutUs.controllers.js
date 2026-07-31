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
exports.getAboutUs = exports.createOrUpdateAboutUs = void 0;
const aboutUs_model_1 = require("./aboutUs.model");
const aboutUs_validation_1 = require("./aboutUs.validation");
const createOrUpdateAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const files = req.files;
        const body = JSON.parse(req.body.data);
        if ((_a = files === null || files === void 0 ? void 0 : files.ceoImage) === null || _a === void 0 ? void 0 : _a.length) {
            body.ceoSection.image = files.ceoImage[0].path;
        }
        if ((_b = files === null || files === void 0 ? void 0 : files.aboutImage) === null || _b === void 0 ? void 0 : _b.length) {
            body.aboutSection.image = files.aboutImage[0].path;
        }
        const validatedData = aboutUs_validation_1.createAboutUsValidation.parse(body);
        const aboutUs = yield aboutUs_model_1.AboutUs.findOneAndUpdate({ isDeleted: false }, validatedData, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        res.status(200).json({
            success: true,
            message: "About Us saved successfully.",
            data: aboutUs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createOrUpdateAboutUs = createOrUpdateAboutUs;
const getAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const aboutUs = yield aboutUs_model_1.AboutUs.findOne({
            isDeleted: false,
        });
        res.status(200).json({
            success: true,
            data: aboutUs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getAboutUs = getAboutUs;
