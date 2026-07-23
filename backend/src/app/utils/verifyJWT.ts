import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyAccessToken = (
    token: string
): JwtPayload => {

    return jwt.verify(
        token,
        process.env.JWT_SECRET as string
    ) as JwtPayload;

};

export const verifyRefreshToken = (
    token: string
): JwtPayload => {

    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
    ) as JwtPayload;

};