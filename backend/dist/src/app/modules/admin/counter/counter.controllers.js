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
exports.getCounter = exports.createOrUpdateCounter = void 0;
const counter_model_1 = require("./counter.model");
const counter_validation_1 = require("./counter.validation");
// Create Counter if it doesn't exist
// Update Counter if it already exists
const createOrUpdateCounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = counter_validation_1.createOrUpdateCounterSchema.parse(req.body);
        const existingCounter = yield counter_model_1.MatrimonyCounter.findOne();
        if (existingCounter) {
            existingCounter.mobileVerifiedProfiles =
                validatedData.mobileVerifiedProfiles;
            existingCounter.customersServed =
                validatedData.customersServed;
            existingCounter.successfulMatchmakingYears =
                validatedData.successfulMatchmakingYears;
            yield existingCounter.save();
            return res.status(200).json({
                success: true,
                message: "Counter updated successfully",
                data: existingCounter,
            });
        }
        const counter = yield counter_model_1.MatrimonyCounter.create(validatedData);
        return res.status(201).json({
            success: true,
            message: "Counter created successfully",
            data: counter,
        });
    }
    catch (error) {
        console.error("Counter create/update error:", error);
        return res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Failed to create/update counter",
        });
    }
});
exports.createOrUpdateCounter = createOrUpdateCounter;
// Get Counter
const getCounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const counter = yield counter_model_1.MatrimonyCounter.findOne().lean();
        if (!counter) {
            return res.status(404).json({
                success: false,
                message: "Counter not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Counter fetched successfully",
            data: counter,
        });
    }
    catch (error) {
        console.error("Get counter error:", error);
        return res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Failed to fetch counter",
        });
    }
});
exports.getCounter = getCounter;
