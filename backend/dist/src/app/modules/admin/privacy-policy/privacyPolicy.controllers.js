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
exports.getPrivacyPolicy = exports.createOrUpdatePrivacyPolicy = void 0;
const privacyPolicy_model_1 = require("./privacyPolicy.model");
const privacyPolicy_validation_1 = require("./privacyPolicy.validation");
const createOrUpdatePrivacyPolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = privacyPolicy_validation_1.privacyPolicySchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }
        const privacyPolicy = yield privacyPolicy_model_1.PrivacyPolicy.findOneAndUpdate({}, {
            $set: validationResult.data,
        }, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        return res.status(200).json({
            success: true,
            message: "Privacy Policy saved successfully",
            data: privacyPolicy,
        });
    }
    catch (error) {
        console.error("Create/Update Privacy Policy Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save Privacy Policy",
        });
    }
});
exports.createOrUpdatePrivacyPolicy = createOrUpdatePrivacyPolicy;
const getPrivacyPolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privacyPolicy = yield privacyPolicy_model_1.PrivacyPolicy.findOne().lean();
        if (!privacyPolicy) {
            return res.status(404).json({
                success: false,
                message: "Privacy Policy not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Privacy Policy fetched successfully",
            data: privacyPolicy,
        });
    }
    catch (error) {
        console.error("Get Privacy Policy Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch Privacy Policy",
        });
    }
});
exports.getPrivacyPolicy = getPrivacyPolicy;
