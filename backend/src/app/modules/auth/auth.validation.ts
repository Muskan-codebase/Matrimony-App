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

const firebaseTokenSchema = z
    .string()
    .trim()
    .min(1, "Firebase token is required");

/**
 * Send OTP
 */

export const sendOtpValidation = z.object({

    countryCode: countryCodeSchema,

    mobile: mobileSchema,

});

/**
 * Verify OTP / Firebase Authentication
 */

export const verifyOtpValidation = z.object({

    mobile: mobileSchema,
    countryCode: countryCodeSchema,
    token: firebaseTokenSchema,

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

    refreshToken: z
        .string()
        .trim()
        .min(10, "Invalid refresh token"),

});

/**
 * Logout
 */

export const logoutValidation = z.object({

    refreshToken: z
        .string()
        .trim()
        .min(10, "Invalid refresh token"),

});

/**
 * Google Login / Firebase Authentication
 */

export const googleLoginValidation = z.object({
    token: firebaseTokenSchema,
});

/**
 * Type Inference
 */

export type SendOtpInput = z.infer<typeof sendOtpValidation>;
export type VerifyOtpInput = z.infer<typeof verifyOtpValidation>;
export type ResendOtpInput = z.infer<typeof resendOtpValidation>;
export type RefreshTokenInput = z.infer<typeof refreshTokenValidation>;
export type LogoutInput = z.infer<typeof logoutValidation>;
export type GoogleLoginInput = z.infer<typeof googleLoginValidation>;