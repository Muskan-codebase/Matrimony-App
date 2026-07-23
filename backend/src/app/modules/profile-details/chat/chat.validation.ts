import { z } from "zod";

export const createChatRoomValidation = z.object({
    senderId: z.string().trim().min(1),
    receiverId: z.string().trim().min(1),
    interestId: z.string().trim().min(1),
});