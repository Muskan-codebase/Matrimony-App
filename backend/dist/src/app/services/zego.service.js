"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomId = exports.generateZegoToken = void 0;
const zegocloud_1 = require("../config/zegocloud");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generateToken04 } = require('../vendor/zegoServerAssistant');
const ZEGO_APP_ID = zegocloud_1.ZEGO_CONFIG.appId;
const ZEGO_SERVER_SECRET = zegocloud_1.ZEGO_CONFIG.serverSecret;
const TOKEN_EXPIRY_SECONDS = 3600;
const generateZegoToken = (userId) => {
    if (!ZEGO_APP_ID || !ZEGO_SERVER_SECRET) {
        throw new Error('Zego credentials are not configured on the server.');
    }
    const token = generateToken04(ZEGO_APP_ID, userId, ZEGO_SERVER_SECRET, TOKEN_EXPIRY_SECONDS, '');
    return {
        token,
        appId: ZEGO_APP_ID,
        userId,
        expiresIn: TOKEN_EXPIRY_SECONDS,
    };
};
exports.generateZegoToken = generateZegoToken;
const generateRoomId = (profileIdA, profileIdB) => {
    return [profileIdA, profileIdB].sort().join('_');
};
exports.generateRoomId = generateRoomId;
