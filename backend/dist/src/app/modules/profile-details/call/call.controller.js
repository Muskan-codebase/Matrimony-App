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
exports.getCallsController = exports.updateCallController = void 0;
const call_service_1 = require("../../../services/call.service");
const profile_model_1 = require("../profile.model");
const updateCallController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, call_service_1.updateCall)(req.body);
    return res.status(200).json({
        success: true,
        message: "Call updated successfully."
    });
});
exports.updateCallController = updateCallController;
const getCallsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get logged-in user's profile
        const profile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        }).select("_id");
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }
        const calls = yield (0, call_service_1.getCalls)(profile._id.toString());
        return res.status(200).json({
            success: true,
            message: "Calls fetched successfully.",
            data: calls,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getCallsController = getCallsController;
