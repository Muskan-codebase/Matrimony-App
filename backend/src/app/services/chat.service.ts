import "../config/firebase"; // adjust the path if needed
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { MessageType } from "../enums/message-type.enum";
import { MessageStatus } from "../enums/message-status.enum";
import { Interest } from "../modules/profile-details/interest/interest.model";
import { InterestStatus } from "../enums/interest-status.enum";
import { Profile } from "../modules/profile-details/profile.model";
import { ChatAttachment } from "../modules/profile-details/chat/chat.interface"; // or wherever you created it
import Auth from "../modules/auth/auth.model";
import { sendEmail } from "./email.service";
import { AccountSettings } from "../modules/account-settings/accountSettings.model";
import Package from "../modules/package/package.model";

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

    await roomRef.set(roomData);

    return roomData;
};

/**
 * Send Message
 */
const MESSAGE_LIMIT = 4;

export const sendMessage = async (
    roomId: string,
    authUserId: string,
    text: string,
    type: MessageType = MessageType.TEXT,
    attachment?: ChatAttachment,
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

    // Fetch interest
    const interest = await Interest.findById(roomData.interestId);

    if (!interest) {
        throw new Error("Interest request not found.");
    }

    if (interest.isDeleted) {
        throw new Error("Interest request has been deleted.");
    }

    /**
     * Validate message
     */
    if (type === MessageType.TEXT) {

        if (!text?.trim()) {
            throw new Error("Message text is required.");
        }

    } else {

        if (!attachment) {
            throw new Error("Attachment is required for this message type.");
        }

    }

    /**
     * Restrict messages while interest is pending
     */
    if (interest.status === InterestStatus.PENDING) {

        const messageCounts = roomData.messageCounts || {};

        const senderMessageCount =
            messageCounts[senderProfileId] || 0;

        if (senderMessageCount >= MESSAGE_LIMIT) {
            throw new Error(
                "You have reached the maximum of 4 messages. Wait until the interest request is accepted."
            );
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

        attachment: attachment ?? null,

        status: MessageStatus.SENT,

        createdAt: FieldValue.serverTimestamp(),
    };

    await messageRef.set(message);

    /**
 * Contact Alert Email
 *
 * Send email when:
 * - Interest is not accepted
 * - Receiver has contactAlertMails enabled
 */
    if (interest.status !== InterestStatus.ACCEPTED) {

        const receiverProfile = await Profile.findById(
            receiverProfileId
        )
            .select("userId basicDetails.firstName")
            .lean();

        if (receiverProfile) {

            const [receiverAuth, accountSettings] =
                await Promise.all([

                    Auth.findById(receiverProfile.userId)
                        .select("email")
                        .lean(),

                    AccountSettings.findOne({
                        userId: receiverProfile.userId,
                        isDeleted: false,
                    })
                        .select(
                            "notificationSettings.emailNotifications.contactAlertMails"
                        )
                        .lean(),
                ]);

            const contactAlertEnabled =
                accountSettings
                    ?.notificationSettings
                    ?.emailNotifications
                    ?.contactAlertMails !== false;

            if (
                contactAlertEnabled &&
                receiverAuth?.email
            ) {

                const senderName =
                    `${senderProfile.basicDetails?.firstName || ""} ${senderProfile.basicDetails?.lastName || ""
                        }`.trim();

                await sendEmail({

                    to: receiverAuth.email,

                    name:
                        receiverProfile.basicDetails?.firstName ||
                        "User",

                    subject:
                        "You Have Received a New Message on SahaJeevan",

                    html: `
                    <h2>New Message Received</h2>

                    <p>
                        Hi ${receiverProfile.basicDetails?.firstName ||
                        "User"
                        },
                    </p>

                    <p>
                        <strong>${senderName}</strong>
                        has sent you a message on SahaJeevan.
                    </p>

                    <p>
                        Log in to your SahaJeevan account
                        to view and reply to the message.
                    </p>

                    <p>
                        Regards,<br>
                        SahaJeevan Team
                    </p>
                `,
                });
            }
        }
    }

    /**
     * Increment sender's message count
     * Only while interest is pending
     */
    let updatedMessageCounts = roomData.messageCounts || {};

    if (interest.status === InterestStatus.PENDING) {

        updatedMessageCounts = {

            ...updatedMessageCounts,

            [senderProfileId]:
                (updatedMessageCounts[senderProfileId] || 0) + 1,
        };
    }

    /**
     * Chat list preview
     */
    let lastMessage = text;

    switch (type) {

        case MessageType.IMAGE:
            lastMessage = text?.trim()
                ? `📷 ${text}`
                : "📷 Photo";
            break;

        case MessageType.VIDEO:
            lastMessage = text?.trim()
                ? `🎥 ${text}`
                : "🎥 Video";
            break;

        case MessageType.AUDIO:
            lastMessage = text?.trim()
                ? `🎵 ${text}`
                : "🎵 Audio";
            break;

        case MessageType.DOCUMENT:
            lastMessage = text?.trim()
                ? `📄 ${text}`
                : `📄 ${attachment?.fileName ?? "Document"}`;
            break;

        default:
            lastMessage = text;
    }

    /**
     * Update parent room
     */
    await roomRef.update({

        messageCounts: updatedMessageCounts,

        lastMessage,

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
export const getChats = async (authUserId: string) => {

    // Find logged-in user's profile
    const profile = await Profile.findOne({
        userId: authUserId,
        isDeleted: false,
    });

    if (!profile) {
        throw new Error("Profile not found.");
    }

    const profileId = profile._id.toString();

    // Fetch all chat rooms
    const snapshot = await db
        .collection("chats")
        .where("participants", "array-contains", profileId)
        .orderBy("lastMessageAt", "desc")
        .get();

    const chats = await Promise.all(

        snapshot.docs.map(async (doc) => {

            const room = doc.data();

            const participants = room.participants as string[];

            // Get the other participant
            const otherProfileId = participants.find(
                id => id !== profileId
            );

            if (!otherProfileId) {
                return null;
            }

            // Fetch profile details
            const otherProfile = await Profile.findOne({
                _id: otherProfileId,
                isDeleted: false,
            }).lean();

            if (!otherProfile) {
                return null;
            }

            const otherAuth = await Auth.findById(
                otherProfile.userId
            )
                .select("mobile countryCode firebaseUid")
                .lean();

            const formatDate = (date: any) => {
                if (!date) return null;

                const d = date.toDate ? date.toDate() : new Date(date);

                const day = String(d.getDate()).padStart(2, "0");
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const year = d.getFullYear();

                return `${day}-${month}-${year}`;
            };

            return {

                roomId: doc.id,

                participant: {

                    profileId: otherProfile._id,

                    firebaseUid: otherAuth?.firebaseUid || null,

                    firstName:
                        otherProfile.basicDetails?.firstName || "",

                    lastName:
                        otherProfile.basicDetails?.lastName || "",

                    fullName: `${otherProfile.basicDetails?.firstName || ""} ${otherProfile.basicDetails?.lastName || ""}`.trim(),

                    profilePhoto:
                        otherProfile.photos?.length
                            ? otherProfile.photos[0]
                            : null,

                    mobile: otherAuth?.mobile || null,

                    countryCode: otherAuth?.countryCode || null,

                    subscription: otherProfile.subscription?.isActive
                        ? {
                            isActive: true,
                            packageId: otherProfile.subscription.packageId,
                            expiryDate: otherProfile.subscription.expiryDate
                        }
                        : {
                            isActive: false
                        }
                },

                lastMessage: room.lastMessage,

                lastMessageType: room.lastMessageType,

                lastMessageSender: room.lastMessageSender,

                lastMessageAt: formatDate(room.lastMessageAt),

                isActive: room.isActive,

                interestId: room.interestId,
            };

        })

    );

    return chats.filter(Boolean);

};

/**
 * Get all my messages of a chat room
 */
export const getMessages = async (
    roomId: string,
    authUserId: string,
) => {

    // Find logged-in user's profile
    const profile = await Profile.findOne({
        userId: authUserId,
        isDeleted: false,
    });

    if (!profile) {
        throw new Error("Profile not found.");
    }

    const profileId = profile._id.toString();

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

    // Verify participant
    const participants = roomData.participants as string[];

    if (!participants.includes(profileId)) {
        throw new Error("Unauthorized.");
    }

    const otherProfileId = participants.find(
        id => id !== profileId
    );

    if (!otherProfileId) {
        throw new Error("Other participant not found.");
    }

    const otherProfile = await Profile.findOne({
        _id: otherProfileId,
        isDeleted: false,
    }).lean();

    if (!otherProfile) {
        throw new Error("Other profile not found.");
    }

    const otherAuth = await Auth.findById(
        otherProfile.userId
    )
        .select("mobile countryCode firebaseUid")
        .lean();

    let packageDetails = null;

    if (
        otherProfile.subscription?.isActive &&
        otherProfile.subscription?.packageId
    ) {
        packageDetails = await Package.findById(
            otherProfile.subscription.packageId
        )
            .select("title")
            .lean();
    }

    // Fetch all messages
    const messagesSnapshot = await roomRef
        .collection("messages")
        .orderBy("createdAt", "asc")
        .get();

    // return messagesSnapshot.docs.map((doc) => ({

    //     messageId: doc.id,

    //     ...doc.data(),

    // }));

    return {
        participant: {
            profileId: otherProfile._id,

            firebaseUid: otherAuth?.firebaseUid || null,

            fullName:
                `${otherProfile.basicDetails?.firstName || ""} ${otherProfile.basicDetails?.lastName || ""}`.trim(),

            profilePhoto:
                otherProfile.photos?.length
                    ? otherProfile.photos[0]
                    : null,

            subscription: otherProfile.subscription?.isActive
                ? {
                    isActive: true,
                    packageName: packageDetails?.title || null,
                    packageId: otherProfile.subscription.packageId,
                    expiryDate: otherProfile.subscription.expiryDate
                }
                : {
                    isActive: false
                },

            mobile: otherAuth?.mobile || null,

            countryCode: otherAuth?.countryCode || null,
        },

        messages: messagesSnapshot.docs.map((doc) => ({
            messageId: doc.id,
            ...doc.data(),
        })),
    };
};