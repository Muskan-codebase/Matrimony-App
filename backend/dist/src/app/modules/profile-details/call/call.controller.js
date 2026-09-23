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
exports.getCallsController = exports.getCallTokenController = exports.updateCallController = void 0;
const call_service_1 = require("../../../services/call.service");
const zego_service_1 = require("../../../services/zego.service");
const profile_model_1 = require("../profile.model");
const call_limit_service_1 = require("./call.limit.service");
const updateCallController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Only gate the call at creation time ("ringing"). Every other
        // status (answered/rejected/missed/ended) is just a lifecycle
        // update on a call that was already allowed to start.
        if (((_a = req.body) === null || _a === void 0 ? void 0 : _a.status) === 'ringing' && ((_b = req.body) === null || _b === void 0 ? void 0 : _b.senderId)) {
            const limitResult = yield (0, call_limit_service_1.checkCallLimit)(req.body.senderId);
            if (!limitResult.allowed) {
                return res.status(403).json({
                    success: false,
                    message: limitResult.message,
                });
            }
        }
        yield (0, call_service_1.updateCall)(req.body);
        return res.status(200).json({
            success: true,
            message: 'Call updated successfully.',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateCallController = updateCallController;
/**
 * Issues a ZegoCloud token for the authenticated user, after checking
 * their package's callLimit / dailyCallLimit via checkCallLimit().
 * The frontend calls this right before joining a Zego room; /call/update
 * (above) remains the source of truth for call history/limit counting.
 */
const getCallTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiverId, callType } = req.body;
        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: 'receiverId is required.',
            });
        }
        const callerProfile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        }).select('_id');
        if (!callerProfile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found.',
            });
        }
        const callerProfileId = callerProfile._id.toString();
        if (callerProfileId === receiverId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot call yourself.',
            });
        }
        const limitResult = yield (0, call_limit_service_1.checkCallLimit)(callerProfileId);
        if (!limitResult.allowed) {
            return res.status(403).json({
                success: false,
                message: limitResult.message,
            });
        }
        const { token, appId, expiresIn } = (0, zego_service_1.generateZegoToken)(callerProfileId);
        const roomId = (0, zego_service_1.generateRoomId)(callerProfileId, receiverId);
        return res.status(200).json({
            success: true,
            message: 'Call token generated successfully.',
            data: {
                token,
                appId,
                roomId,
                userId: callerProfileId,
                callType: callType !== null && callType !== void 0 ? callType : 'voice',
                expiresIn,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getCallTokenController = getCallTokenController;
const getCallsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get logged-in user's profile
        const profile = yield profile_model_1.Profile.findOne({
            userId: req.user.id,
        }).select('_id');
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found.',
            });
        }
        const calls = yield (0, call_service_1.getCalls)(profile._id.toString());
        return res.status(200).json({
            success: true,
            message: 'Calls fetched successfully.',
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
