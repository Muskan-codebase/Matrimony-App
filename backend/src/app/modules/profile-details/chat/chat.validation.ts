import { z } from "zod";

export const createChatRoomValidation = z.object({
    interestId: z.string().trim().min(1),
});