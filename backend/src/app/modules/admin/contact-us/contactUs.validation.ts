import { z } from "zod";

export const contactUsSchema = z.object({
    officeAddress: z
        .string()
        .trim()
        .min(1, "Office address is required"),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address"),
});

export type ContactUsInput = z.infer<typeof contactUsSchema>;