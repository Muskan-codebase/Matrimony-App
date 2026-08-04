import "../config/firebase";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const db = getFirestore();

export const updateCall = async (payload: any) => {

    const callRef = db.collection("calls").doc(payload.callId);

    const snapshot = await callRef.get();

    if (!snapshot.exists) {

        await callRef.set({

            callId: payload.callId,
            callerId: payload.callerId,
            receiverId: payload.receiverId,
            callType: payload.callType,
            status: payload.status,
            startedAt: FieldValue.serverTimestamp(),
            answeredAt: null,
            endedAt: null,
            duration: 0,
            endedBy: null,
        });

        return;
    }

    const updateData: any = {
        status: payload.status,
    };

    if (payload.status === "answered") {

        updateData.answeredAt =
            FieldValue.serverTimestamp();
    }

    if (
        payload.status === "ended" ||
        payload.status === "rejected" ||
        payload.status === "missed"
    ) {

        updateData.endedAt =
            FieldValue.serverTimestamp();

        updateData.duration =
            payload.duration ?? 0;

        updateData.endedBy =
            payload.endedBy ?? null;
    }

    await callRef.update(updateData);

    // Update chat preview when call finishes
    if (
        payload.status === "ended" ||
        payload.status === "rejected" ||
        payload.status === "missed"
    ) {
        const roomId = [payload.callerId, payload.receiverId]
            .sort()
            .join("_");

        await db.collection("chats").doc(roomId).update({
            lastMessageType: "call",
            lastCallType: payload.callType, // voice | video
            lastCallStatus: payload.status, // ended | rejected | missed
            lastMessageTime: FieldValue.serverTimestamp(),
        });
    }
};