"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const messaging_1 = require("firebase-admin/messaging");
const auth_model_js_1 = __importDefault(require("../modules/auth/auth.model.js"));
const messaging = (0, messaging_1.getMessaging)(firebase_1.default);
const sendNotification = (_a) => __awaiter(void 0, [_a], void 0, function* ({ receiverId, title, body, data = {}, }) {
    var _b;
    const user = yield auth_model_js_1.default.findById(receiverId).select("fcmTokens");
    const tokens = (_b = user === null || user === void 0 ? void 0 : user.fcmTokens) !== null && _b !== void 0 ? _b : [];
    if (tokens.length === 0) {
        return;
    }
    const messages = tokens.map((token) => ({
        token,
        notification: {
            title,
            body,
        },
        data,
    }));
    yield messaging.sendEach(messages);
});
exports.sendNotification = sendNotification;
