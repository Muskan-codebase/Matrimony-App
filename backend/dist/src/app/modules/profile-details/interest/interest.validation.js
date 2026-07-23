"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInterestSchema = exports.createInterestSchema = void 0;
const zod_1 = require("zod");
exports.createInterestSchema = zod_1.z.object({
    body: zod_1.z.object({
        receiverId: zod_1.z.string().min(1, "Receiver Id is required."),
    }),
});
exports.updateInterestSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([
            "Accepted",
            "Rejected",
            "Withdrawn",
        ]),
    }),
});
