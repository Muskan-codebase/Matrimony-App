import "../config/firebase";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const db = getFirestore();

export const updateCall = async (payload: any) => {

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
};