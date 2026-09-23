import { z } from "zod";

export const updateCallSchema = z.object({
    callId: z.string().min(1),

    callerId: z.string().min(1),

    receiverId: z.string().min(1),

    callType: z.enum(["voice", "video"]),

    status: z.enum([
        "ringing",
        "answered",
        "rejected",
        "ended",
        "missed",
    ]),

    duration: z.number().optional(),

    endedBy: z.string().optional(),
});