import { z } from "zod";

export const createBlockSchema = z.object({
    blockedUserId: z.string().min(1, "Blocked User ID is required"),
});

export const blockIdSchema = z.object({
    id: z.string().min(1, "Block ID is required"),
});