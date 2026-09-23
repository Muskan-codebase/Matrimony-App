"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTokenSchema = void 0;
const zod_1 = require("zod");
exports.registerTokenSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "FCM token is required"),
});
