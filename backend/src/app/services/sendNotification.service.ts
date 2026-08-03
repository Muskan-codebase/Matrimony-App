import app from "../config/firebase";
import { getMessaging } from "firebase-admin/messaging";
import Auth from "../modules/auth/auth.model";

const messaging = getMessaging(app);

interface SendNotificationParams {
    receiverId: string;
    title: string;
    body: string;
    data?: Record<string, string>;
}

export const sendNotification = async ({
    receiverId,
    title,
    body,
    data = {},
}: SendNotificationParams) => {
    const user = await Auth.findById(receiverId).select("fcmTokens");

    const tokens = user?.fcmTokens ?? [];

    console.log("FCM Tokens:", tokens);

    if (tokens.length === 0) {
        console.log("No FCM tokens found for user:", receiverId);
        return;
    }

    const messages = tokens.map((token) => ({
        token,
        notification: {
            title,
            body,
        },
        data,
    }));

    const response = await messaging.sendEach(messages);

    console.log(response);
    console.log("Sending notification...");
    console.log({ receiverId, title, body, data });
};