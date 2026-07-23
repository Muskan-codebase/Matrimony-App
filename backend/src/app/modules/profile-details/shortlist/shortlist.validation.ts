import { z } from "zod";

export const createShortlistSchema = z.object({
  shortlistedUserId: z.string().min(1, "Shortlisted User ID is required"),
});

export const shortlistIdSchema = z.object({
  id: z.string().min(1, "Shortlist ID is required"),
});