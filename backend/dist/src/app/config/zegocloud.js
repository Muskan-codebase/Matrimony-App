"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZEGO_CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ZEGO_CONFIG = {
    appId: Number(process.env.ZEGOCLOUD_APP_ID),
    serverSecret: process.env.ZEGOCLOUD_SERVER_SECRET,
};
