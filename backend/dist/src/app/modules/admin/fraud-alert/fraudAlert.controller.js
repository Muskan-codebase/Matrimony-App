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
exports.getFraudAlert = exports.createOrUpdateFraudAlert = void 0;
const fraudAlert_model_1 = require("./fraudAlert.model");
const fraudAlert_validation_1 = require("./fraudAlert.validation");
const createOrUpdateFraudAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = fraudAlert_validation_1.fraudAlertSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.flatten().fieldErrors,
            });
        }
        const fraudAlert = yield fraudAlert_model_1.FraudAlert.findOneAndUpdate({}, {
            $set: validationResult.data,
        }, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        return res.status(200).json({
            success: true,
            message: "Fraud & Alert saved successfully",
            data: fraudAlert,
        });
    }
    catch (error) {
        console.error("Create/Update Fraud & Alert Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save Fraud & Alert",
        });
    }
});
exports.createOrUpdateFraudAlert = createOrUpdateFraudAlert;
const getFraudAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fraudAlert = yield fraudAlert_model_1.FraudAlert.findOne().lean();
        if (!fraudAlert) {
            return res.status(404).json({
                success: false,
                message: "Fraud & Alert not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Fraud & Alert fetched successfully",
            data: fraudAlert,
        });
    }
    catch (error) {
        console.error("Get Fraud & Alert Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch Fraud & Alert",
        });
    }
});
exports.getFraudAlert = getFraudAlert;
