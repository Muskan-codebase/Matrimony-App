import { z } from "zod";

/**
 * Admin Login
 */
export const adminLoginValidation = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .email("Invalid email address."),

        password: z
            .string()
            .trim()
            .min(6, "Password must be at least 6 characters.")
            .max(100, "Password is too long."),
    }),
});

/**
 * Refresh Token
 */
export const adminRefreshTokenValidation = z.object({
    body: z.object({
        refreshToken: z
            .string()
            .trim()
            .min(10, "Invalid refresh token."),
    }),
});

/**
 * Logout
 */
export const adminLogoutValidation = z.object({
    body: z.object({
        refreshToken: z
            .string()
            .trim()
            .min(10, "Invalid refresh token."),
    }),
});

/**
 * Types
 */

export type AdminLoginInput = z.infer<typeof adminLoginValidation>;

export type AdminRefreshTokenInput = z.infer<
    typeof adminRefreshTokenValidation
>;

export type AdminLogoutInput = z.infer<
    typeof adminLogoutValidation
>;