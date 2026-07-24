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
exports.getChats = exports.sendMessage = exports.createChatRoom = void 0;
require("../config/firebase"); // adjust the path if needed
const firestore_1 = require("firebase-admin/firestore");
const message_type_enum_1 = require("../enums/message-type.enum");
const message_status_enum_1 = require("../enums/message-status.enum");
const interest_model_1 = require("../modules/profile-details/interest/interest.model");
const interest_status_enum_1 = require("../enums/interest-status.enum");
const db = (0, firestore_1.getFirestore)();
/**
 * Generates a unique room ID for two users.
 * The order is always the same to prevent duplicate rooms.
 */
const generateRoomId = (user1, user2) => {
    return [user1, user2].sort().join("_");
};
/**
 * Creates a chat room if:
 * 1. Interest request exists
 * 2. Interest is accepted
 * 3. Interest is not deleted
 * 4. Both users belong to the interest
 * 5. Room doesn't already exist
 */
const createChatRoom = (senderId, receiverId, interestId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find Interest Request
    const interest = yield interest_model_1.Interest.findById(interestId);
    if (!interest) {
        throw new Error("Interest request not found.");
    }
    // Interest Request Deleted
    if (interest.isDeleted) {
        throw new Error("Interest request has been deleted.");
    }
    // Chat allowed only after acceptance
    if (interest.status !== interest_status_enum_1.InterestStatus.ACCEPTED) {
        throw new Error("Chat is allowed only after the interest request is accepted.");
    }
    // Verify both users belong to this interest
    const isValidParticipants = (interest.senderId.toString() === senderId &&
        interest.receiverId.toString() === receiverId) ||
        (interest.senderId.toString() === receiverId &&
            interest.receiverId.toString() === senderId);
    if (!isValidParticipants) {
        throw new Error("Invalid chat participants.");
    }
    // Generate Unique Room ID
    const roomId = generateRoomId(senderId, receiverId);
    const roomRef = db.collection("chats").doc(roomId);
    const roomSnapshot = yield roomRef.get();
    // Return Existing Room
    if (roomSnapshot.exists) {
        return roomSnapshot.data();
    }
    // Create Chat Room
    const roomData = {
        roomId,
        participants: [senderId, receiverId],
        interestId,
        createdBy: senderId,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        lastMessage: "",
        lastMessageSender: null,
        lastMessageType: null,
        lastMessageAt: null,
        isActive: true,
    };
    yield roomRef.set(roomData);
    return roomData;
});
exports.createChatRoom = createChatRoom;
const sendMessage = (roomId_1, senderId_1, receiverId_1, text_1, ...args_1) => __awaiter(void 0, [roomId_1, senderId_1, receiverId_1, text_1, ...args_1], void 0, function* (roomId, senderId, receiverId, text, type = message_type_enum_1.MessageType.TEXT) {
    // Check whether room exists
    const roomRef = db.collection("chats").doc(roomId);
    const roomSnapshot = yield roomRef.get();
    if (!roomSnapshot.exists) {
        throw new Error("Chat room not found.");
    }
    // Create new message
    const messageRef = roomRef.collection("messages").doc();
    const message = {
        messageId: messageRef.id,
        senderId,
        receiverId,
        text,
        type,
        status: message_status_enum_1.MessageStatus.SENT,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    };
    yield messageRef.set(message);
    // Update room metadata
    yield roomRef.update({
        lastMessage: text,
        lastMessageSender: senderId,
        lastMessageType: type,
        lastMessageAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return Object.assign({ roomId }, message);
});
exports.sendMessage = sendMessage;
const getChats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield db
        .collection("chats")
        .where("participants", "array-contains", userId)
        .orderBy("lastMessageAt", "desc")
        .get();
    return snapshot.docs.map((doc) => (Object.assign({ roomId: doc.id }, doc.data())));
});
exports.getChats = getChats;
