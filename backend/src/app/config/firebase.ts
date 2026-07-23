//This File intializes/Configures Backend with Firebase 🔥

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { ServiceAccount } from "firebase-admin";
import serviceAccount from "./firebase/serviceAccountKey.json";

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
      });

export default app;