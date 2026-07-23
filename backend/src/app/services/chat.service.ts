import "../config/firebase"; // adjust the path if needed
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { MessageType } from "../enums/message-type.enum";
import { MessageStatus } from "../enums/message-status.enum";

const db = getFirestore();

/**
 * Generates a unique room ID for two users.
 * The order is always the same to prevent duplicate rooms.
 */
const generateRoomId = (user1: string, user2: string): string => {
    return [user1, user2].sort().join("_");
};

/**
 * Creates a chat room if it doesn't already exist.
 */
export const createChatRoom = async (
    senderId: string,
    receiverId: string,
    interestId: string,
) => {

    const roomId = generateRoomId(senderId, receiverId);

    const roomRef = db.collection("chats").doc(roomId);

    const roomSnapshot = await roomRef.get();

    // Room already exists
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