import crypto from "crypto";

export const generateOtp = (): string => {
    return crypto.randomInt(1000, 10000).toString();
};