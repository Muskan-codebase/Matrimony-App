"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateCounterSchema = void 0;
const zod_1 = require("zod");
exports.createOrUpdateCounterSchema = zod_1.z.object({
    mobileVerifiedProfiles: zod_1.z
        .string()
        .trim()
        .min(1, "Mobile verified profiles is required"),
    customersServed: zod_1.z
        .string()
        .trim()
        .min(1, "Customers served is required"),
    successfulMatchmakingYears: zod_1.z
        .string()
        .trim()
        .min(1, "Successful matchmaking years is required"),
});
