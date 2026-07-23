"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutValidation = exports.refreshTokenValidation = exports.resendOtpValidation = exports.verifyOtpValidation = exports.sendOtpValidation = void 0;
const zod_1 = require("zod");
/**
 * Common Validations
 */
const mobileSchema = zod_1.z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number");
const countryCodeSchema = zod_1.z
    .string()
    .trim()
    .regex(/^\+\d{1,4}$/, "Invalid country code");
const otpSchema = zod_1.z
    .string()
    .trim()
    .regex(/^\d+$/, "OTP must contain only digits")
    .length(4, "OTP must be exactly 4 digits");
/**
 * Send OTP
 */
exports.sendOtpValidation = zod_1.z.object({
    countryCode: countryCodeSchema,
    mobile: mobileSchema,
});
/**
 * Verify OTP
 */
exports.verifyOtpValidation = zod_1.z.object({
    mobile: mobileSchema,
    otp: otpSchema,
});
/**
 * Resend OTP
 */
exports.resendOtpValidation = zod_1.z.object({
    mobile: mobileSchema,
});
/**
 * Refresh Token
 */
exports.refreshTokenValidation = zod_1.z.object({
    refreshToken: zod_1.z.string().trim().min(10, "Invalid refresh token"),
});
/**
 * Logout
 */
exports.logoutValidation = zod_1.z.object({
    refreshToken: zod_1.z.string().trim().min(10, "Invalid refresh token"),
});
