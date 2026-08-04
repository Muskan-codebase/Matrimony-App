"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZegoToken = void 0;
const zegocloud_1 = require("../config/zegocloud");
const zegoServerAssistant_1 = require("../utils/zego/zegoServerAssistant");
const TOKEN_EXPIRE_TIME = 60 * 60; // 1 hour
const generateZegoToken = (userId) => {
    return (0, zegoServerAssistant_1.generateToken04)(zegocloud_1.ZEGO_CONFIG.appId, userId, zegocloud_1.ZEGO_CONFIG.serverSecret, TOKEN_EXPIRE_TIME, "");
};
exports.generateZegoToken = generateZegoToken;
