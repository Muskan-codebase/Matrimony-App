import "../config/firebase"; // adjust the path if needed
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { MessageType } from "../enums/message-type.enum";
import { MessageStatus } from "../enums/message-status.enum";
import { Interest } from "../modules/profile-details/interest/interest.model";
import { InterestStatus } from "../enums/interest-status.enum";

const db = getFirestore();

/**
 * Generates a unique room ID for two users.
 * The order is always the same to prevent duplicate rooms.
 */
const generateRoomId = (user1: string, user2: string): string => {
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
export const createChatRoom = async (
    senderId: string,
    receiverId: string,
    interestId: string,
) => {

    // Find Interest Request
    const interest = await Interest.findById(interestId);

    if (!interest) {
        throw new Error("Interest request not found.");
    }

    // Interest Request Deleted
    if (interest.isDeleted) {
        throw new Error("Interest request has been deleted.");
    }

    // Chat allowed only after acceptance
    if (interest.status !== InterestStatus.ACCEPTED) {
        throw new Error(
            "Chat is allowed only after the interest request is accepted."
        );
    }

    // Verify both users belong to this interest
    const isValidParticipants =
        (
            interest.senderId.toString() === senderId &&
            interest.receiverId.toString() === receiverId
        ) ||
        (
            interest.senderId.toString() === receiverId &&
            interest.receiverId.toString() === senderId
        );

    if (!isValidParticipants) {
        throw new Error("Invalid chat participants.");
    }

    // Generate Unique Room ID
    const roomId = generateRoomId(senderId, receiverId);

    const roomRef = db.collection("chats").doc(roomId);

    const roomSnapshot = await roomRef.get();

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
        createdAt: FieldValue.serverTimestamp(),

        lastMessage: "",
        lastMessageSender: null,
        lastMessageType: null,
        lastMessageAt: null,

        isActive: true,
    };

    await roomRef.set(roomData);

    return roomData;
};

export const sendMessage = async (
    roomId: string,
    senderId: string,
    receiverId: string,
    text: string,
    type: MessageType = MessageType.TEXT,
) => {

    // Check whether room exists
    const roomRef = db.collection("chats").doc(roomId);

    const roomSnapshot = await roomRef.get();

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

        status: MessageStatus.SENT,

        createdAt: FieldValue.serverTimestamp(),

    };

    await messageRef.set(message);

    // Update room metadata
    await roomRef.update({

        lastMessage: text,

        lastMessageSender: senderId,

        lastMessageType: type,

        lastMessageAt: FieldValue.serverTimestamp(),

    });

    return {

        roomId,

        ...message,

    };
};

export const getChats = async (userId: string) => {
    const snapshot = await db
        .collection("chats")
        .where("participants", "array-contains", userId)
        .orderBy("lastMessageAt", "desc")
        .get();

    return snapshot.docs.map((doc) => ({
        roomId: doc.id,
        ...doc.data(),
    }));
};