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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCall = void 0;
require("../config/firebase");
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
const updateCall = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const callRef = db.collection("calls").doc(payload.callId);
    const snapshot = yield callRef.get();
    if (!snapshot.exists) {
        yield callRef.set({
            callId: payload.callId,
            callerId: payload.callerId,
            receiverId: payload.receiverId,
            callType: payload.callType,
            status: payload.status,
            startedAt: firestore_1.FieldValue.serverTimestamp(),
            answeredAt: null,
            endedAt: null,
            duration: 0,
            endedBy: null,
        });
        return;
    }
    const updateData = {
        status: payload.status,
    };
    if (payload.status === "answered") {
        updateData.answeredAt =
            firestore_1.FieldValue.serverTimestamp();
    }
    if (payload.status === "ended" ||
        payload.status === "rejected" ||
        payload.status === "missed") {
        updateData.endedAt =
            firestore_1.FieldValue.serverTimestamp();
        updateData.duration =
            (_a = payload.duration) !== null && _a !== void 0 ? _a : 0;
        updateData.endedBy =
            (_b = payload.endedBy) !== null && _b !== void 0 ? _b : null;
    }
    yield callRef.update(updateData);
    // Update chat preview when call finishes
    if (payload.status === "ended" ||
        payload.status === "rejected" ||
        payload.status === "missed") {
        const roomId = [payload.callerId, payload.receiverId]
            .sort()
            .join("_");
        let lastMessage = `${payload.callType} call`;
        if (payload.status === "missed") {
            lastMessage = `Missed ${payload.callType} call`;
        }
        else if (payload.status === "rejected") {
            lastMessage = `Rejected ${payload.callType} call`;
        }
        yield db.collection("chats").doc(roomId).update({
            lastMessage,
            lastMessageTime: firestore_1.FieldValue.serverTimestamp(),
        });
    }
});
exports.updateCall = updateCall;
