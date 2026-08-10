import { z } from "zod";

export const privacyPolicySchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Privacy Policy content is required"),
});

export type PrivacyPolicyInput = z.infer<typeof privacyPolicySchema>;