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
    interestId: string,
) => {

    // Find Interest
    const interest = await Interest.findById(interestId);

    if (!interest) {
        throw new Error("Interest request not found.");
    }

    if (interest.isDeleted) {
        throw new Error("Interest request has been deleted.");
    }

    if (interest.status !== InterestStatus.ACCEPTED) {
        throw new Error(
            "Chat is allowed only after the interest request is accepted."
        );
    }

    // Logged-in user must belong to this interest
    const isParticipant =
        interest.senderId.toString() === senderId ||
        interest.receiverId.toString() === senderId;

    if (!isParticipant) {
        throw new Error("Unauthorized.");
    }

    // Derive receiver automatically
    const receiverId =
        interest.senderId.toString() === senderId
            ? interest.receiverId.toString()
            : interest.senderId.toString();

    const roomId = generateRoomId(senderId, receiverId);

    const roomRef = db.collection("chats").doc(roomId);

    const roomSnapshot = await roomRef.get();

    if (roomSnapshot.exists) {
        return roomSnapshot.data();
    }

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
    text: string,
    type: MessageType = MessageType.TEXT,
) => {

    // Check whether room exists
    const roomRef = db.collection("chats").doc(roomId);

    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) {
        throw new Error("Chat room not found.");
    }

    const roomData = roomSnapshot.data();

    if (!roomData) {
        throw new Error("Chat room data not found.");
    }

    const participants = roomData.participants as string[];

    // Verify sender belongs to this room
    if (!participants.includes(senderId)) {
        throw new Error("Unauthorized.");
    }

    // Find receiver
    const receiverId = participants.find(
        (participant) => participant !== senderId
    );

    if (!receiverId) {
        throw new Error("Receiver not found.");
    }

    // Create message
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

    // Update parent chat room
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