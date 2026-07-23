"use strict";
// This file initializes/configures Backend with Firebase 🔥
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
};
const app = (0, app_1.getApps)().length > 0
    ? (0, app_1.getApps)()[0]
    : (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(serviceAccount),
    });
exports.default = app;
