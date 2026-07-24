"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatRoomValidation = void 0;
const zod_1 = require("zod");
exports.createChatRoomValidation = zod_1.z.object({
    receiverId: zod_1.z.string().trim().min(1),
    interestId: zod_1.z.string().trim().min(1),
});
