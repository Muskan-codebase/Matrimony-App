import dotenv from "dotenv";

dotenv.config();

export const ZEGO_CONFIG = {
    appId: Number(process.env.ZEGOCLOUD_APP_ID),
    serverSecret: process.env.ZEGOCLOUD_SERVER_SECRET!,
};