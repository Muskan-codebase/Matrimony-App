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
exports.getMessages = exports.getChats = exports.sendMessage = exports.createChatRoom = void 0;
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
        // Track how many messages each user has sent
        messageCounts: {
            [senderProfileId]: 0,
            [receiverProfileId]: 0,
        },
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
const MESSAGE_LIMIT = 4;
const sendMessage = (roomId_1, authUserId_1, text_1, ...args_1) => __awaiter(void 0, [roomId_1, authUserId_1, text_1, ...args_1], void 0, function* (roomId, authUserId, text, type = message_type_enum_1.MessageType.TEXT, attachment) {
    var _a;
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
    // Fetch interest
    const interest = yield interest_model_1.Interest.findById(roomData.interestId);
    if (!interest) {
        throw new Error("Interest request not found.");
    }
    if (interest.isDeleted) {
        throw new Error("Interest request has been deleted.");
    }
    /**
     * Validate message
     */
    if (type === message_type_enum_1.MessageType.TEXT) {
        if (!(text === null || text === void 0 ? void 0 : text.trim())) {
            throw new Error("Message text is required.");
        }
    }
    else {
        if (!attachment) {
            throw new Error("Attachment is required for this message type.");
        }
    }
    /**
     * Restrict messages while interest is pending
     */
    if (interest.status === interest_status_enum_1.InterestStatus.PENDING) {
        const messageCounts = roomData.messageCounts || {};
        const senderMessageCount = messageCounts[senderProfileId] || 0;
        if (senderMessageCount >= MESSAGE_LIMIT) {
            throw new Error("You have reached the maximum of 4 messages. Wait until the interest request is accepted.");
        }
    }
    /**
     * Create message
     */
    const messageRef = roomRef.collection("messages").doc();
    const message = {
        messageId: messageRef.id,
        senderId: senderProfileId,
        receiverId: receiverProfileId,
        text,
        type,
        attachment: attachment !== null && attachment !== void 0 ? attachment : null,
        status: message_status_enum_1.MessageStatus.SENT,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    };
    yield messageRef.set(message);
    /**
     * Increment sender's message count
     * Only while interest is pending
     */
    let updatedMessageCounts = roomData.messageCounts || {};
    if (interest.status === interest_status_enum_1.InterestStatus.PENDING) {
        updatedMessageCounts = Object.assign(Object.assign({}, updatedMessageCounts), { [senderProfileId]: (updatedMessageCounts[senderProfileId] || 0) + 1 });
    }
    /**
     * Chat list preview
     */
    let lastMessage = text;
    switch (type) {
        case message_type_enum_1.MessageType.IMAGE:
            lastMessage = (text === null || text === void 0 ? void 0 : text.trim())
                ? `📷 ${text}`
                : "📷 Photo";
            break;
        case message_type_enum_1.MessageType.VIDEO:
            lastMessage = (text === null || text === void 0 ? void 0 : text.trim())
                ? `🎥 ${text}`
                : "🎥 Video";
            break;
        case message_type_enum_1.MessageType.AUDIO:
            lastMessage = (text === null || text === void 0 ? void 0 : text.trim())
                ? `🎵 ${text}`
                : "🎵 Audio";
            break;
        case message_type_enum_1.MessageType.DOCUMENT:
            lastMessage = (text === null || text === void 0 ? void 0 : text.trim())
                ? `📄 ${text}`
                : `📄 ${(_a = attachment === null || attachment === void 0 ? void 0 : attachment.fileName) !== null && _a !== void 0 ? _a : "Document"}`;
            break;
        default:
            lastMessage = text;
    }
    /**
     * Update parent room
     */
    yield roomRef.update({
        messageCounts: updatedMessageCounts,
        lastMessage,
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
// export const getChats = async (authUserId: string) => {
//     // Find profile
//     const profile = await Profile.findOne({ userId: authUserId });
//     if (!profile) {
//         throw new Error("Profile not found.");
//     }
//     const profileId = profile._id.toString();
//     const snapshot = await db
//         .collection("chats")
//         .where("participants", "array-contains", profileId)
//         .orderBy("lastMessageAt", "desc")
//         .get();
//     return snapshot.docs.map(doc => ({
//         roomId: doc.id,
//         ...doc.data(),
//     }));
// };
/**
 * Get all chats of logged-in user
 */
const getChats = (authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find logged-in user's profile
    const profile = yield profile_model_1.Profile.findOne({
        userId: authUserId,
        isDeleted: false,
    });
    if (!profile) {
        throw new Error("Profile not found.");
    }
    const profileId = profile._id.toString();
    // Fetch all chat rooms
    const snapshot = yield db
        .collection("chats")
        .where("participants", "array-contains", profileId)
        .orderBy("lastMessageAt", "desc")
        .get();
    const chats = yield Promise.all(snapshot.docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const room = doc.data();
        const participants = room.participants;
        // Get the other participant
        const otherProfileId = participants.find(id => id !== profileId);
        if (!otherProfileId) {
            return null;
        }
        // Fetch profile details
        const otherProfile = yield profile_model_1.Profile.findOne({
            _id: otherProfileId,
            isDeleted: false,
        }).lean();
        if (!otherProfile) {
            return null;
        }
        return {
            roomId: doc.id,
            participant: {
                profileId: otherProfile._id,
                firstName: ((_a = otherProfile.basicDetails) === null || _a === void 0 ? void 0 : _a.firstName) || "",
                lastName: ((_b = otherProfile.basicDetails) === null || _b === void 0 ? void 0 : _b.lastName) || "",
                fullName: `${((_c = otherProfile.basicDetails) === null || _c === void 0 ? void 0 : _c.firstName) || ""} ${((_d = otherProfile.basicDetails) === null || _d === void 0 ? void 0 : _d.lastName) || ""}`.trim(),
                profilePhoto: ((_e = otherProfile.photos) === null || _e === void 0 ? void 0 : _e.length)
                    ? otherProfile.photos[0]
                    : null,
            },
            lastMessage: room.lastMessage,
            lastMessageType: room.lastMessageType,
            lastMessageSender: room.lastMessageSender,
            lastMessageAt: room.lastMessageAt,
            isActive: room.isActive,
            interestId: room.interestId,
        };
    })));
    return chats.filter(Boolean);
});
exports.getChats = getChats;
/**
 * Get all my messages of a chat room
 */
const getMessages = (roomId, authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find logged-in user's profile
    const profile = yield profile_model_1.Profile.findOne({
        userId: authUserId,
        isDeleted: false,
    });
    if (!profile) {
        throw new Error("Profile not found.");
    }
    const profileId = profile._id.toString();
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
    // Verify participant
    const participants = roomData.participants;
    if (!participants.includes(profileId)) {
        throw new Error("Unauthorized.");
    }
    // Fetch all messages
    const messagesSnapshot = yield roomRef
        .collection("messages")
        .orderBy("createdAt", "asc")
        .get();
    return messagesSnapshot.docs.map((doc) => (Object.assign({ messageId: doc.id }, doc.data())));
});
exports.getMessages = getMessages;
