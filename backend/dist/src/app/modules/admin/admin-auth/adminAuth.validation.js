"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogoutValidation = exports.adminRefreshTokenValidation = exports.adminLoginValidation = void 0;
const zod_1 = require("zod");
/**
 * Admin Login
 */
exports.adminLoginValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .trim()
            .email("Invalid email address."),
        password: zod_1.z
            .string()
            .trim()
            .min(6, "Password must be at least 6 characters.")
            .max(100, "Password is too long."),
    }),
});
/**
 * Refresh Token
 */
exports.adminRefreshTokenValidation = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z
            .string()
            .trim()
            .min(10, "Invalid refresh token."),
    }),
});
/**
 * Logout
 */
exports.adminLogoutValidation = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z
            .string()
            .trim()
            .min(10, "Invalid refresh token."),
    }),
});
