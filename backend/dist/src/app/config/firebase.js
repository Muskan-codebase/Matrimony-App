"use strict";
//This File intializes/Configures Backend with Firebase 🔥
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const serviceAccountKey_json_1 = __importDefault(require("./firebase/serviceAccountKey.json"));
const app = (0, app_1.getApps)().length > 0
    ? (0, app_1.getApps)()[0]
    : (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(serviceAccountKey_json_1.default),
    });
exports.default = app;
