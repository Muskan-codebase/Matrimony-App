import "../config/firebase";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { Profile } from "../modules/profile-details/profile.model";

const db = getFirestore();

export const updateCall = async (payload: any) => {

    try {

        console.log("========== updateCall ==========");
        console.log(payload);

        const callRef = db.collection("calls").doc(payload.callId);

        const snapshot = await callRef.get();

        if (!snapshot.exists) {
            await callRef.set({
                callId: payload.callId,
                senderId: payload.senderId,
                receiverId: payload.receiverId,
                callType: payload.callType,
                status: payload.status,
                createdAt: FieldValue.serverTimestamp(),
            });

            return;
        }

        await callRef.update({
            status: payload.status,
        });

        // Update chat preview
        const roomId = [payload.senderId, payload.receiverId]
            .sort()
            .join("_");

        console.log("Room ID:", roomId);

        const chatRef = db.collection("chats").doc(roomId);
        const chatDoc = await chatRef.get();

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

        await db.collection("chats").doc(roomId).update({
            lastMessage,
            lastMessageType: "voice",
            lastMessageAt: FieldValue.serverTimestamp(),
        });

        console.log("Chat updated successfully");

        const updatedDoc = await chatRef.get();
        console.log(updatedDoc.data());

        // Create chat message
        const messageRef = chatRef.collection("messages").doc();

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
            duration: payload.duration ?? 0,
            createdAt: FieldValue.serverTimestamp(),
        };

        console.log("Creating call message:", messageRef.path);

        await messageRef.set(message);

        console.log("Call message created successfully.");

        // Update chat preview
        await chatRef.update({
            lastMessage,
            lastMessageType: "VOICE_CALL",
            lastMessageSender: payload.senderId,
            lastMessageAt: FieldValue.serverTimestamp(),
        });

        console.log("Chat preview updated successfully.");

        const updatedChat = await chatRef.get();
        console.log("Updated chat:", updatedChat.data());

    } catch (error) {
        console.error("Error updating call:", error);
        throw error;
    }
};

export const getCalls = async (profileId: string) => {

    console.log("Logged-in profileId:", profileId);

    const [sentCalls, receivedCalls] = await Promise.all([
        db.collection("calls")
            .where("senderId", "==", profileId)
            .get(),

        db.collection("calls")
            .where("receiverId", "==", profileId)
            .get(),
    ]);

    const callsMap = new Map();

    sentCalls.docs.forEach((doc) => {
        callsMap.set(doc.id, {
            id: doc.id,
            ...doc.data(),
        });
    });

    receivedCalls.docs.forEach((doc) => {
        callsMap.set(doc.id, {
            id: doc.id,
            ...doc.data(),
        });
    });

    console.log("Received calls:", receivedCalls.size);

    sentCalls.forEach(doc => console.log("Sent:", doc.data()));
    receivedCalls.forEach(doc => console.log("Received:", doc.data()));

    const calls = Array.from(callsMap.values()).sort((a: any, b: any) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
    });

    const enrichedCalls = await Promise.all(
        calls.map(async (call: any) => {

            const otherProfileId =
                call.senderId === profileId
                    ? call.receiverId
                    : call.senderId;

            const profile = await Profile.findById(otherProfileId)
                .select("basicDetails.firstName basicDetails.lastName photos subscription");

            return {
                ...call,
                participant: profile
                    ? {
                        profileId: profile._id,
                        firstName: profile.basicDetails?.firstName,
                        lastName: profile.basicDetails?.lastName,
                        fullName: `${profile.basicDetails?.firstName ?? ""} ${profile.basicDetails?.lastName ?? ""}`.trim(),
                        profilePhoto: profile.photos?.[0] ?? null,
                        subscription: profile.subscription,
                    }
                    : null,
            };
        })
    );

    return enrichedCalls;
};