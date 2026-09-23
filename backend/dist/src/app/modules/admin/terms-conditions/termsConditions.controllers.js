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
exports.getTermsConditions = exports.createOrUpdateTermsConditions = void 0;
const termsConditions_model_1 = require("./termsConditions.model");
const termsConditions_validation_1 = require("./termsConditions.validation");
const createOrUpdateTermsConditions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = termsConditions_validation_1.termsConditionsSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }
        const termsConditions = yield termsConditions_model_1.TermsConditions.findOneAndUpdate({}, {
            $set: validationResult.data,
        }, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        return res.status(200).json({
            success: true,
            message: "Terms & Conditions saved successfully",
            data: termsConditions,
        });
    }
    catch (error) {
        console.error("Create/Update Terms & Conditions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save Terms & Conditions",
        });
    }
});
exports.createOrUpdateTermsConditions = createOrUpdateTermsConditions;
const getTermsConditions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const termsConditions = yield termsConditions_model_1.TermsConditions.findOne().lean();
        if (!termsConditions) {
            return res.status(404).json({
                success: false,
                message: "Terms & Conditions not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Terms & Conditions fetched successfully",
            data: termsConditions,
        });
    }
    catch (error) {
        console.error("Get Terms & Conditions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch Terms & Conditions",
        });
    }
});
exports.getTermsConditions = getTermsConditions;
