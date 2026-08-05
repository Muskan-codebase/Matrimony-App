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
    console.log("========== updateCall ==========");
    console.log(payload);
    const callRef = db.collection("calls").doc(payload.callId);
    const snapshot = yield callRef.get();
    if (!snapshot.exists) {
        yield callRef.set({
            callId: payload.callId,
            senderId: payload.senderId,
            receiverId: payload.receiverId,
            callType: payload.callType,
            status: payload.status,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        return;
    }
    yield callRef.update({
        status: payload.status,
    });
    // Update chat preview
    const roomId = [payload.senderId, payload.receiverId]
        .sort()
        .join("_");
    console.log("Room ID:", roomId);
    const chatRef = db.collection("chats").doc(roomId);
    const chatDoc = yield chatRef.get();
    console.log("Chat exists:", chatDoc.exists);
    if (!chatDoc.exists) {
        console.log("Chat document not found!");
        return;
    }
    let lastMessage = "";
    switch (payload.status) {
        case "missed":
            lastMessage = `Missed ${payload.callType} call`;
            break;
        case "rejected":
            lastMessage = `Rejected ${payload.callType} call`;
            break;
        default:
            lastMessage = `${payload.callType} call`;
    }
    yield db.collection("chats").doc(roomId).update({
        lastMessage,
        lastMessageType: "voice",
        lastMessageAt: firestore_1.FieldValue.serverTimestamp(),
    });
    console.log("Chat updated successfully");
});
exports.updateCall = updateCall;
