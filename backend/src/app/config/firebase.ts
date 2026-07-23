// This file initializes/configures Backend with Firebase 🔥

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { ServiceAccount } from "firebase-admin";

const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert(serviceAccount),
        });

export default app;