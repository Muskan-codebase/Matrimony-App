import { z } from "zod";

export const createOrUpdateCounterSchema = z.object({
    mobileVerifiedProfiles: z
        .string()
        .trim()
        .min(1, "Mobile verified profiles is required"),

    customersServed: z
        .string()
        .trim()
        .min(1, "Customers served is required"),

    successfulMatchmakingYears: z
        .string()
        .trim()
        .min(1, "Successful matchmaking years is required"),
});