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
exports.getContactUs = exports.createOrUpdateContactUs = void 0;
const contactUs_validation_1 = require("./contactUs.validation");
const contactUs_model_1 = __importDefault(require("./contactUs.model"));
//create or update contact us
const createOrUpdateContactUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateData = contactUs_validation_1.contactUsSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validateData.error.flatten().fieldErrors,
            });
        }
        const contactUs = yield contactUs_model_1.default.findOneAndUpdate({}, {
            $set: validateData.data
        }, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        return res.status(200).json({
            success: true,
            message: "Contact us details saved successfully",
            data: contactUs
        });
    }
    catch (error) {
        console.error("Create/Update Contact Us Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save Contact Us details",
        });
    }
});
exports.createOrUpdateContactUs = createOrUpdateContactUs;
//get contact Us
const getContactUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactUs = yield contactUs_model_1.default.find().lean();
        if (!contactUs) {
            res.status(400).json({
                success: false,
                message: "contact us details not found"
            });
            return;
        }
        return res.status(200).json({
            success: false,
            message: "Contact us details fetched successfully",
            data: contactUs
        });
    }
    catch (error) {
        console.error("Get Contact Us Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch Contact Us details",
        });
    }
});
exports.getContactUs = getContactUs;
