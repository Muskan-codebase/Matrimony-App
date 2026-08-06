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
    var _a, _b;
    try {
        console.log("\n================ UPDATE CALL START ================");
        console.log("Timestamp:", new Date().toISOString());
        console.log("Payload:");
        console.log(JSON.stringify(payload, null, 2));
        const callRef = db.collection("calls").doc(payload.callId);
        console.log("Call Document Path:", callRef.path);
        // Fetch existing call
        console.log("Fetching call document...");
        const snapshot = yield callRef.get();
        console.log("Call document exists:", snapshot.exists);
        if (snapshot.exists) {
            console.log("Existing Call Data:");
            console.log(snapshot.data());
        }
        // First update for this call
        if (!snapshot.exists) {
            console.log("Call document not found. Creating new call document...");
            yield callRef.set({
                callId: payload.callId,
                senderId: payload.senderId,
                receiverId: payload.receiverId,
                callType: payload.callType,
                status: payload.status,
                createdAt: firestore_1.FieldValue.serverTimestamp(),
            });
            console.log("Call document created successfully.");
            console.log("================ UPDATE CALL END ================\n");
            return;
        }
        // Update call status
        console.log("Updating call status...");
        console.log("Old Status:", (_a = snapshot.data()) === null || _a === void 0 ? void 0 : _a.status);
        console.log("New Status:", payload.status);
        yield callRef.update({
            status: payload.status,
        });
        console.log("Call status updated successfully.");
        // Generate Room ID
        const roomId = [payload.senderId, payload.receiverId]
            .sort()
            .join("_");
        console.log("Sender ID:", payload.senderId);
        console.log("Receiver ID:", payload.receiverId);
        console.log("Generated Room ID:", roomId);
        // Fetch chat
        const chatRef = db.collection("chats").doc(roomId);
        console.log("Chat Document Path:", chatRef.path);
        const chatDoc = yield chatRef.get();
        console.log("Chat exists:", chatDoc.exists);
        if (!chatDoc.exists) {
            console.log("Chat document not found.");
            console.log("================ UPDATE CALL END ================\n");
            return;
        }
        console.log("Current Chat Data:");
        console.log(chatDoc.data());
        // Generate last message
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
        console.log("Generated Last Message:", lastMessage);
        // Update chat preview
        console.log("Updating chat preview...");
        yield chatRef.update({
            lastMessage,
            lastMessageType: "voice",
            lastMessageAt: firestore_1.FieldValue.serverTimestamp(),
        });
        console.log("Chat preview updated successfully.");
        const updatedChatPreview = yield chatRef.get();
        console.log("Updated Chat Preview:");
        console.log(updatedChatPreview.data());
        // Create call message
        const messageRef = chatRef.collection("messages").doc();
        console.log("Message Document Path:", messageRef.path);
        const message = {
            messageId: messageRef.id,
            senderId: payload.senderId,
            receiverId: payload.receiverId,
            text: lastMessage,
            type: "VOICE_CALL",
            attachment: null,
            status: "SENT",
            callId: payload.callId,
            callType: payload.callType,
            callStatus: payload.status,
            duration: (_b = payload.duration) !== null && _b !== void 0 ? _b : 0,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        };
        console.log("Message Object:");
        console.log(JSON.stringify(message, null, 2));
        console.log("Creating call message...");
        yield messageRef.set(message);
        console.log("Call message created successfully.");
        // Update chat preview again
        console.log("Updating final chat preview...");
        yield chatRef.update({
            lastMessage,
            lastMessageType: "VOICE_CALL",
            lastMessageSender: payload.senderId,
            lastMessageAt: firestore_1.FieldValue.serverTimestamp(),
        });
        console.log("Final chat preview updated successfully.");
        const finalChat = yield chatRef.get();
        console.log("Final Chat Data:");
        console.log(finalChat.data());
        console.log("================ UPDATE CALL END ================\n");
    }
    catch (error) {
        console.log("\n================ UPDATE CALL ERROR ================");
        console.error(error);
        console.log("Payload causing error:");
        console.log(JSON.stringify(payload, null, 2));
        console.log("================ END ERROR ========================\n");
        throw error;
    }
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
