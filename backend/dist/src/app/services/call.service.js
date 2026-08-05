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
exports.getCalls = exports.updateCall = void 0;
require("../config/firebase");
const firestore_1 = require("firebase-admin/firestore");
const profile_model_1 = require("../modules/profile-details/profile.model");
const db = (0, firestore_1.getFirestore)();
const updateCall = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    const updatedDoc = yield chatRef.get();
    console.log(updatedDoc.data());
    // Create call message
    const messageRef = chatRef.collection("messages").doc();
    const message = {
        messageId: messageRef.id,
        senderId: payload.senderId,
        receiverId: payload.receiverId,
        text: lastMessage,
        type: "VOICE_CALL", // or whatever enum/string your app uses
        attachment: null,
        status: "SENT", // or MessageStatus.SENT
        callId: payload.callId,
        callType: payload.callType,
        callStatus: payload.status,
        duration: (_a = payload.duration) !== null && _a !== void 0 ? _a : 0,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    };
    yield messageRef.set(message);
    // Update chat preview
    yield chatRef.update({
        lastMessage,
        lastMessageType: "VOICE_CALL", // use the same type consistently
        lastMessageSender: payload.senderId,
        lastMessageAt: firestore_1.FieldValue.serverTimestamp(),
    });
});
exports.updateCall = updateCall;
const getCalls = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Logged-in profileId:", profileId);
    const [sentCalls, receivedCalls] = yield Promise.all([
        db.collection("calls")
            .where("senderId", "==", profileId)
            .get(),
        db.collection("calls")
            .where("receiverId", "==", profileId)
            .get(),
    ]);
    const callsMap = new Map();
    sentCalls.docs.forEach((doc) => {
        callsMap.set(doc.id, Object.assign({ id: doc.id }, doc.data()));
    });
    receivedCalls.docs.forEach((doc) => {
        callsMap.set(doc.id, Object.assign({ id: doc.id }, doc.data()));
    });
    console.log("Received calls:", receivedCalls.size);
    sentCalls.forEach(doc => console.log("Sent:", doc.data()));
    receivedCalls.forEach(doc => console.log("Received:", doc.data()));
    const calls = Array.from(callsMap.values()).sort((a, b) => {
        var _a, _b, _c, _d, _e, _f;
        const aTime = (_c = (_b = (_a = a.createdAt) === null || _a === void 0 ? void 0 : _a.toMillis) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : 0;
        const bTime = (_f = (_e = (_d = b.createdAt) === null || _d === void 0 ? void 0 : _d.toMillis) === null || _e === void 0 ? void 0 : _e.call(_d)) !== null && _f !== void 0 ? _f : 0;
        return bTime - aTime;
    });
    const enrichedCalls = yield Promise.all(calls.map((call) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const otherProfileId = call.senderId === profileId
            ? call.receiverId
            : call.senderId;
        const profile = yield profile_model_1.Profile.findById(otherProfileId)
            .select("basicDetails.firstName basicDetails.lastName photos subscription");
        return Object.assign(Object.assign({}, call), { participant: profile
                ? {
                    profileId: profile._id,
                    firstName: (_a = profile.basicDetails) === null || _a === void 0 ? void 0 : _a.firstName,
                    lastName: (_b = profile.basicDetails) === null || _b === void 0 ? void 0 : _b.lastName,
                    fullName: `${(_d = (_c = profile.basicDetails) === null || _c === void 0 ? void 0 : _c.firstName) !== null && _d !== void 0 ? _d : ""} ${(_f = (_e = profile.basicDetails) === null || _e === void 0 ? void 0 : _e.lastName) !== null && _f !== void 0 ? _f : ""}`.trim(),
                    profilePhoto: (_h = (_g = profile.photos) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : null,
                    subscription: profile.subscription,
                }
                : null });
    })));
    return enrichedCalls;
});
exports.getCalls = getCalls;
