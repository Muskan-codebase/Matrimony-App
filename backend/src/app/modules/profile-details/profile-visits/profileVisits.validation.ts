import { z } from "zod";

export const createProfileVisitSchema = z.object({
  visitedProfileId: z.string(),
});

export type CreateProfileVisitInput = z.infer<
  typeof createProfileVisitSchema
>;