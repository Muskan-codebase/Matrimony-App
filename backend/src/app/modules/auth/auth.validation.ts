import { z } from "zod";

/**
 * Common Validations
 */

const mobileSchema = z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number");

const countryCodeSchema = z
    .string()
    .trim()
    .regex(/^\+\d{1,4}$/, "Invalid country code");

const otpSchema = z
    .string()
    .trim()
    .regex(/^\d+$/, "OTP must contain only digits")
    .length(4, "OTP must be exactly 4 digits");

/**
 * Send OTP
 */
export const sendOtpValidation = z.object({
    countryCode: countryCodeSchema,
    mobile: mobileSchema,
});

/**
 * Verify OTP
 */
export const verifyOtpValidation = z.object({
    mobile: mobileSchema,
    otp: otpSchema,
});

/**
 * Resend OTP
 */
export const resendOtpValidation = z.object({
    mobile: mobileSchema,
});

/**
 * Refresh Token
 */
export const refreshTokenValidation = z.object({
    refreshToken: z.string().trim().min(10, "Invalid refresh token"),
});

/**
 * Logout
 */
export const logoutValidation = z.object({
    refreshToken: z.string().trim().min(10, "Invalid refresh token"),
});

/**
 * Type Inference
 */
export type SendOtpInput = z.infer<typeof sendOtpValidation>;
export type VerifyOtpInput = z.infer<typeof verifyOtpValidation>;
export type ResendOtpInput = z.infer<typeof resendOtpValidation>;
export type RefreshTokenInput = z.infer<typeof refreshTokenValidation>;
export type LogoutInput = z.infer<typeof logoutValidation>;