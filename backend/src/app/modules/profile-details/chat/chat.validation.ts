import { z } from "zod";

export const createChatRoomValidation = z.object({
    receiverId: z.string().trim().min(1),
    interestId: z.string().trim().min(1),
});