"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user._id,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user._id,
    }, process.env.JWT_REFRESH, {
        expiresIn: "7d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
