"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileVisitSchema = void 0;
const zod_1 = require("zod");
exports.createProfileVisitSchema = zod_1.z.object({
    visitedProfileId: zod_1.z.string(),
});
