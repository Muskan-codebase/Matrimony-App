import { ZEGO_CONFIG } from '../config/zegocloud';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generateToken04 } = require('../vendor/zegoServerAssistant');

const ZEGO_APP_ID = ZEGO_CONFIG.appId;
const ZEGO_SERVER_SECRET = ZEGO_CONFIG.serverSecret;

const TOKEN_EXPIRY_SECONDS = 3600;

export const generateZegoToken = (userId: string) => {
  if (!ZEGO_APP_ID || !ZEGO_SERVER_SECRET) {
    throw new Error('Zego credentials are not configured on the server.');
  }

  const token = generateToken04(
    ZEGO_APP_ID,
    userId,
    ZEGO_SERVER_SECRET,
    TOKEN_EXPIRY_SECONDS,
    '',
  );

  return {
    token,
    appId: ZEGO_APP_ID,
    userId,
    expiresIn: TOKEN_EXPIRY_SECONDS,
  };
};

export const generateRoomId = (profileIdA: string, profileIdB: string) => {
  return [profileIdA, profileIdB].sort().join('_');
};
