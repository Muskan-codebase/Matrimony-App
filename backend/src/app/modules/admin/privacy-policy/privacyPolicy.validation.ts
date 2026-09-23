import { z } from "zod";

export const privacyPolicySchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required"),

    content: z
        .string()
        .trim()
        .min(1, "Privacy Policy content is required"),
});

export type PrivacyPolicyInput = z.infer<typeof privacyPolicySchema>;