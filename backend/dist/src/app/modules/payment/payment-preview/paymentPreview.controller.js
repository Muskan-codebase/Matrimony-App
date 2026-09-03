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
exports.previewPaymentController = void 0;
const mongoose_1 = require("mongoose");
const previewPayment_service_1 = require("../../../services/previewPayment.service");
const previewPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profileId, packageId } = req.body;
        if (!profileId || !packageId) {
            return res.status(400).json({
                success: false,
                message: "profileId and packageId are required",
            });
        }
        if (!mongoose_1.Types.ObjectId.isValid(profileId) ||
            !mongoose_1.Types.ObjectId.isValid(packageId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profileId or packageId",
            });
        }
        const result = yield (0, previewPayment_service_1.previewPayment)(new mongoose_1.Types.ObjectId(profileId), new mongoose_1.Types.ObjectId(packageId));
        return res.status(200).json({
            success: true,
            message: "Payment preview fetched successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message ||
                "Failed to fetch payment preview",
        });
    }
});
exports.previewPaymentController = previewPaymentController;
