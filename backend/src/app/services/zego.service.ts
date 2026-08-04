import { ZEGO_CONFIG } from "../config/zegocloud";
import { generateToken04 } from "../utils/zego/zegoServerAssistant";

const TOKEN_EXPIRE_TIME = 60 * 60; // 1 hour

export const generateZegoToken = (userId: string) => {
    return generateToken04(
        ZEGO_CONFIG.appId,
        userId,
        ZEGO_CONFIG.serverSecret,
        TOKEN_EXPIRE_TIME,
        ""
    );
};