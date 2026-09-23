//This File is a Utility service used generate custom token for firebase 🔥

import { getAuth } from "firebase-admin/auth";

export const generateFirebaseToken = async (uid: string) => {
    return await getAuth().createCustomToken(uid);
};