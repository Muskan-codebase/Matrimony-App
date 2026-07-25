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
const profile_model_1 = require("../modules/profile-details/profile.model");
const db = (0, firestore_1.getFirestore)();
/**
 * Generates a unique room ID for two users.
 * Uses Profile IDs to keep consistency across the Matrimony app.
 */
const generateRoomId = (profile1, profile2) => {
    return [profile1, profile2].sort().join("_");
};
/**
 * Creates a chat room if:
 * 1. Interest exists
 * 2. Interest is accepted
 * 3. Interest is not deleted
 * 4. Logged-in user belongs to the interest
 * 5. Chat room doesn't already exist
 */
const createChatRoom = (authUserId, interestId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find logged-in user's profile
    const senderProfile = yield profile_model_1.Profile.findOne({ userId: authUserId });
    if (!senderProfile) {
        throw new Error("Profile not found.");
    }
    const senderProfileId = senderProfile._id.toString();
    // Find interest
    const interest = yield interest_model_1.Interest.findById(interestId);
    if (!interest) {
        throw new Error("Interest request not found.");
    }
    if (interest.isDeleted) {
        throw new Error("Interest request has been deleted.");
    }
    if (interest.status !== interest_status_enum_1.InterestStatus.ACCEPTED) {
        throw new Error("Chat is allowed only after the interest request is accepted.");
    }
    // Logged-in user must belong to this interest
    const isParticipant = interest.senderId.toString() === senderProfileId ||
        interest.receiverId.toString() === senderProfileId;
    if (!isParticipant) {
        throw new Error("Unauthorized.");
    }
    // Determine receiver profile id
    const receiverProfileId = interest.senderId.toString() === senderProfileId
        ? interest.receiverId.toString()
        : interest.senderId.toString();
    const roomId = generateRoomId(senderProfileId, receiverProfileId);
    const roomRef = db.collection("chats").doc(roomId);
    const roomSnapshot = yield roomRef.get();
    if (roomSnapshot.exists) {
        return roomSnapshot.data();
    }
    const roomData = {
        roomId,
        participants: [
            senderProfileId,
            receiverProfileId,
        ],
        interestId,
        createdBy: senderProfileId,
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
/**
 * Send Message
 */
const sendMessage = (roomId_1, authUserId_1, text_1, ...args_1) => __awaiter(void 0, [roomId_1, authUserId_1, text_1, ...args_1], void 0, function* (roomId, authUserId, text, type = message_type_enum_1.MessageType.TEXT) {
    // Find sender profile
    const senderProfile = yield profile_model_1.Profile.findOne({ userId: authUserId });
    if (!senderProfile) {
        throw new Error("Profile not found.");
    }
    const senderProfileId = senderProfile._id.toString();
    // Check room
    const roomRef = db.collection("chats").doc(roomId);
    const roomSnapshot = yield roomRef.get();
    if (!roomSnapshot.exists) {
        throw new Error("Chat room not found.");
    }
    const roomData = roomSnapshot.data();
    if (!roomData) {
        throw new Error("Chat room data not found.");
    }
    const participants = roomData.participants;
    // Verify sender belongs to room
    if (!participants.includes(senderProfileId)) {
        throw new Error("Unauthorized.");
    }
    // Find receiver
    const receiverProfileId = participants.find(participant => participant !== senderProfileId);
    if (!receiverProfileId) {
        throw new Error("Receiver not found.");
    }
    // Create message
    const messageRef = roomRef.collection("messages").doc();
    const message = {
        messageId: messageRef.id,
        senderId: senderProfileId,
        receiverId: receiverProfileId,
        text,
        type,
        status: message_status_enum_1.MessageStatus.SENT,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    };
    yield messageRef.set(message);
    // Update parent room
    yield roomRef.update({
        lastMessage: text,
        lastMessageSender: senderProfileId,
        lastMessageType: type,
        lastMessageAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return Object.assign({ roomId }, message);
});
exports.sendMessage = sendMessage;
/**
 * Get Chats
 */
const getChats = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find profile
    const profile = yield profile_model_1.Profile.findOne({ userId: authUserId });
    if (!profile) {
        throw new Error("Profile not found.");
    }
    const profileId = profile._id.toString();
    const snapshot = yield db
        .collection("chats")
        .where("participants", "array-contains", profileId)
        .orderBy("lastMessageAt", "desc")
        .get();
    return snapshot.docs.map(doc => (Object.assign({ roomId: doc.id }, doc.data())));
});
exports.getChats = getChats;
