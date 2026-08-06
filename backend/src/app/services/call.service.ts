import "../config/firebase";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { Profile } from "../modules/profile-details/profile.model";

const db = getFirestore();

export const updateCall = async (payload: any) => {
    try {
        console.log("\n================ UPDATE CALL START ================");
        console.log("Timestamp:", new Date().toISOString());
        console.log("Payload:");
        console.log(JSON.stringify(payload, null, 2));

        const callRef = db.collection("calls").doc(payload.callId);

        console.log("Call Document Path:", callRef.path);

        // Fetch existing call
        console.log("Fetching call document...");
        const snapshot = await callRef.get();

        console.log("Call document exists:", snapshot.exists);

        if (snapshot.exists) {
            console.log("Existing Call Data:");
            console.log(snapshot.data());
        }

        // First update for this call
        if (!snapshot.exists) {
            console.log("Call document not found. Creating new call document...");

            await callRef.set({
                callId: payload.callId,
                senderId: payload.senderId,
                receiverId: payload.receiverId,
                callType: payload.callType,
                status: payload.status,
                createdAt: FieldValue.serverTimestamp(),
            });

            console.log("Call document created successfully.");
            console.log("================ UPDATE CALL END ================\n");
            return;
        }

        // Update call status
        console.log("Updating call status...");
        console.log("Old Status:", snapshot.data()?.status);
        console.log("New Status:", payload.status);

        await callRef.update({
            status: payload.status,
        });

        console.log("Call status updated successfully.");

        // Generate Room ID
        const roomId = [payload.senderId, payload.receiverId]
            .sort()
            .join("_");

        console.log("Sender ID:", payload.senderId);
        console.log("Receiver ID:", payload.receiverId);
        console.log("Generated Room ID:", roomId);

        // Fetch chat
        const chatRef = db.collection("chats").doc(roomId);

        console.log("Chat Document Path:", chatRef.path);

        const chatDoc = await chatRef.get();

        console.log("Chat exists:", chatDoc.exists);

        if (!chatDoc.exists) {
            console.log("Chat document not found.");
            console.log("================ UPDATE CALL END ================\n");
            return;
        }

        console.log("Current Chat Data:");
        console.log(chatDoc.data());

        // Generate last message
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

        console.log("Generated Last Message:", lastMessage);

        // Update chat preview
        console.log("Updating chat preview...");

        await chatRef.update({
            lastMessage,
            lastMessageType: "voice",
            lastMessageAt: FieldValue.serverTimestamp(),
        });

        console.log("Chat preview updated successfully.");

        const updatedChatPreview = await chatRef.get();

        console.log("Updated Chat Preview:");
        console.log(updatedChatPreview.data());

        // Create call message
        const messageRef = chatRef.collection("messages").doc();

        console.log("Message Document Path:", messageRef.path);

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

        console.log("Message Object:");
        console.log(JSON.stringify(message, null, 2));

        console.log("Creating call message...");

        await messageRef.set(message);

        console.log("Call message created successfully.");

        // Update chat preview again
        console.log("Updating final chat preview...");

        await chatRef.update({
            lastMessage,
            lastMessageType: "VOICE_CALL",
            lastMessageSender: payload.senderId,
            lastMessageAt: FieldValue.serverTimestamp(),
        });

        console.log("Final chat preview updated successfully.");

        const finalChat = await chatRef.get();

        console.log("Final Chat Data:");
        console.log(finalChat.data());

        console.log("================ UPDATE CALL END ================\n");
    } catch (error) {
        console.log("\n================ UPDATE CALL ERROR ================");
        console.error(error);

        console.log("Payload causing error:");
        console.log(JSON.stringify(payload, null, 2));

        console.log("================ END ERROR ========================\n");

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