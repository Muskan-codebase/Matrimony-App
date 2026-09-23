"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCallSchema = void 0;
const zod_1 = require("zod");
exports.updateCallSchema = zod_1.z.object({
    callId: zod_1.z.string().min(1),
    callerId: zod_1.z.string().min(1),
    receiverId: zod_1.z.string().min(1),
    callType: zod_1.z.enum(["voice", "video"]),
    status: zod_1.z.enum([
        "ringing",
        "answered",
        "rejected",
        "ended",
        "missed",
    ]),
    duration: zod_1.z.number().optional(),
    endedBy: zod_1.z.string().optional(),
});
