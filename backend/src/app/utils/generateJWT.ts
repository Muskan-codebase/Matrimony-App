import jwt from "jsonwebtoken";
import { IUserAuth } from "../modules/auth/auth.interface";

export const generateAccessToken = (user: IUserAuth): string => {

    return jwt.sign(
        {
            id: user._id,
            mobile: user.mobile,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "5m",
        }
    );

};

export const generateRefreshToken = (user: IUserAuth): string => {

    return jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_REFRESH as string,
        {
            expiresIn: "7d",
        }
    );

};