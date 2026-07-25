import "../config/firebase"; // adjust the path if needed
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { MessageType } from "../enums/message-type.enum";
import { MessageStatus } from "../enums/message-status.enum";
import { Interest } from "../modules/profile-details/interest/interest.model";
import { InterestStatus } from "../enums/interest-status.enum";
import { Profile } from "../modules/profile-details/profile.model";

const db = getFirestore();

/**
 * Generates a unique room ID for two users.
 * Uses Profile IDs to keep consistency across the Matrimony app.
 */
const generateRoomId = (profile1: string, profile2: string): string => {
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
export const createChatRoom = async (
    authUserId: string,
    interestId: string,
) => {

    // Find logged-in user's profile
    const senderProfile = await Profile.findOne({ userId: authUserId });

    if (!senderProfile) {
        throw new Error("Profile not found.");
    }

    const senderProfileId = senderProfile._id.toString();

    // Find interest
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
        interest.senderId.toString() === senderProfileId ||
        interest.receiverId.toString() === senderProfileId;

    if (!isParticipant) {
        throw new Error("Unauthorized.");
    }

    // Determine receiver profile id
    const receiverProfileId =
        interest.senderId.toString() === senderProfileId
            ? interest.receiverId.toString()
            : interest.senderId.toString();

    const roomId = generateRoomId(
        senderProfileId,
        receiverProfileId
    );

    const roomRef = db.collection("chats").doc(roomId);

    const roomSnapshot = await roomRef.get();

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

/**
 * Send Message
 */
export const sendMessage = async (
    roomId: string,
    authUserId: string,
    text: string,
    type: MessageType = MessageType.TEXT,
) => {

    // Find sender profile
    const senderProfile = await Profile.findOne({ userId: authUserId });

    if (!senderProfile) {
        throw new Error("Profile not found.");
    }

    const senderProfileId = senderProfile._id.toString();

    // Check room
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

    // Verify sender belongs to room
    if (!participants.includes(senderProfileId)) {
        throw new Error("Unauthorized.");
    }

    // Find receiver
    const receiverProfileId = participants.find(
        participant => participant !== senderProfileId
    );

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

        status: MessageStatus.SENT,

        createdAt: FieldValue.serverTimestamp(),
    };

    await messageRef.set(message);

    // Update parent room
    await roomRef.update({
        lastMessage: text,
        lastMessageSender: senderProfileId,
        lastMessageType: type,
        lastMessageAt: FieldValue.serverTimestamp(),
    });

    return {
        roomId,
        ...message,
    };
};

/**
 * Get Chats
 */
export const getChats = async (authUserId: string) => {

    // Find profile
    const profile = await Profile.findOne({ userId: authUserId });

    if (!profile) {
        throw new Error("Profile not found.");
    }

    const profileId = profile._id.toString();

    const snapshot = await db
        .collection("chats")
        .where("participants", "array-contains", profileId)
        .orderBy("lastMessageAt", "desc")
        .get();

    return snapshot.docs.map(doc => ({
        roomId: doc.id,
        ...doc.data(),
    }));
};