import { Request, Response } from "express";
import Auth from "./auth.model";
import Otp from "./otp/otp.model";
import { generateOtp } from "../../utils/generateOTP";
import {
    sendOtpValidation, verifyOtpValidation,
    resendOtpValidation, refreshTokenValidation
} from "./auth.validation";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateJWT";
import { generateFirebaseToken } from "../../config/firebase.service";
import { verifyAccessToken, verifyRefreshToken } from "../../utils/verifyJWT";
import {
    MAX_RESEND_COUNT,
    OTP_EXPIRY_MINUTES,
    RESEND_COOLDOWN_SECONDS,
} from "./auth.constants";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

export const sendOTP = async (req: Request, res: Response) => {

    try {

        const validatedData = sendOtpValidation.parse(req.body);

        const { countryCode, mobile } = validatedData;

        let auth = await Auth.findOne({
            mobile,
            isDeleted: false
        })

        // Track whether this number already belongs to a verified user
        const isExistingUser = !!auth && auth.isVerified;

        //if user does not exists, create a new one
        if (!auth) {

            auth = await Auth.create({
                mobile,
                countryCode,
            });
        }

        //generate OTP
        const otp = generateOtp();

        // OTP Expiry (5 Minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Invalidate previous unused OTPs
        await Otp.updateMany(
            {
                authId: auth._id,
                isUsed: false,
            },
            {
                isUsed: true,
            }
        );

        // Save New OTP
        await Otp.create({
            authId: auth._id,
            otp,
            expiresAt,
        });

        res.status(200).json({
            success: true,
            message: isExistingUser
                ? "OTP sent. Enter it to log in."
                : "OTP sent. Enter it to complete registration.",
            isExistingUser,
            ...(process.env.NODE_ENV === "development" && { data: { otp } }),
        });


    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export const verifyOTP = async (req: Request, res: Response) => {

    try {

        const validatedData = verifyOtpValidation.parse(req.body);

        const { mobile, otp } = validatedData;

        // Check whether user exists
        const auth = await Auth.findOne({
            mobile,
            isDeleted: false,
        });

        if (!auth) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Find latest unused OTP
        const otpRecord = await Otp.findOne({
            authId: auth._id,
            isUsed: false,
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found. Please request a new OTP.",
            });
        }

        // Check expiry
        if (otpRecord.expiresAt < new Date()) {

            otpRecord.isUsed = true;
            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "OTP has expired.",
            });
        }

        // Invalid OTP
        if (otpRecord.otp !== otp) {

            otpRecord.attempts += 1;

            // Maximum 5 attempts
            if (otpRecord.attempts >= 5) {
                otpRecord.isUsed = true;
            }

            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        // OTP Verified
        otpRecord.isUsed = true;
        await otpRecord.save();

        // Capture this BEFORE mutating isVerified below —
        // tells us whether this is a first-time registration or a returning login
        const isNewUser = !auth.isVerified;

        auth.isVerified = true;
        auth.loginCount += 1;
        auth.lastLogin = new Date();

        // Generate Access Token
        const accessToken = generateAccessToken(auth)

        // Generate Refresh Token
        const refreshToken = generateRefreshToken(auth);

        //Generate Firebase Token 🔥
        const firebaseToken = await generateFirebaseToken(auth._id.toString());

        auth.refreshToken = await bcrypt.hash(refreshToken, 10);
        await auth.save();

        return res.status(200).json({
            success: true,
            message: isNewUser
                ? "Registered successfully."
                : "Logged in successfully.",
            isNewUser,
            accessToken,
            refreshToken,
            firebaseToken, //added Firebase referesh token in response 🔥
            user: auth,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const resendOTP = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = resendOtpValidation.parse(req.body);

        const { mobile } = validatedData;

        const auth = await Auth.findOne({
            mobile,
            isDeleted: false,
        });

        if (!auth) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const latestOtp = await Otp.findOne({
            authId: auth._id,
            isUsed: false,
        }).sort({ createdAt: -1 });

        if (!latestOtp) {

            return res.status(400).json({
                success: false,
                message: "No active OTP found. Please request a new OTP.",
            });

        }

        // Maximum resend limit
        if (latestOtp.resendCount >= MAX_RESEND_COUNT) {

            return res.status(429).json({
                success: false,
                message: "Maximum OTP resend limit reached.",
            });

        }

        // 30-second cooldown
        if (latestOtp.lastResendAt) {

            const diff =
                Date.now() -
                latestOtp.lastResendAt.getTime();

            if (
                diff <
                RESEND_COOLDOWN_SECONDS * 1000
            ) {

                return res.status(429).json({
                    success: false,
                    message: `Please wait ${RESEND_COOLDOWN_SECONDS} seconds before requesting another OTP.`,
                });

            }

        }

        // Expire previous OTP
        latestOtp.isUsed = true;

        await latestOtp.save();

        const otp = generateOtp();

        const expiresAt = new Date(
            Date.now() +
            OTP_EXPIRY_MINUTES *
            60 *
            1000
        );

        await Otp.create({

            authId: auth._id,

            otp,

            expiresAt,

            resendCount:
                latestOtp.resendCount + 1,

            lastResendAt: new Date(),

        });

        /**
         * Send SMS here
         */

        return res.status(200).json({

            success: true,

            message: "OTP resent successfully.",

            ...(process.env.NODE_ENV ===
                "development" && { otp }),

        });

    } catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });
    }
};

export const refreshToken = async (req: Request, res: Response) => {

    try {

        const validatedData = refreshTokenValidation.parse(req.body);

        const { refreshToken } = validatedData;

        // Verify Refresh Token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH as string
        ) as JwtPayload;

        const auth = await Auth.findById(decoded.id);

        if (!auth || auth.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Compare hashed refresh token
        const isValidToken = await bcrypt.compare(
            refreshToken,
            auth.refreshToken!
        );

        if (!isValidToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token.",
            });
        }

        // Rotate Tokens
        const newAccessToken = generateAccessToken(auth);

        const newRefreshToken = generateRefreshToken(auth);

        auth.refreshToken = await bcrypt.hash(
            newRefreshToken,
            10
        );

        await auth.save();

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully.",
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });

    } catch (error: any) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token.",
        });

    }

};

export const getCurrentUser = async (
    req: Request,
    res: Response
) => {

    try {

        const { id } = req.user;

        const auth = await Auth.findById(id);

        if (!auth) {

            return res.status(404).json({
                success: false,
                message: "User not found.",
            });

        }

        return res.status(200).json({
            success: true,
            data: auth,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

// export const logout = async (
//     req: Request,
//     res: Response
// ) => {

//     try {

//         const { id } = req.user;

//         const auth = await Auth.findById(id);

//         if (!auth) {

//             return res.status(404).json({
//                 success: false,
//                 message: "User not found.",
//             });

//         }

//         auth.refreshToken = undefined;

//         await auth.save();

//         return res.status(200).json({
//             success: true,
//             message: "Logged out successfully.",
//         });

//     } catch (error: any) {

//         return res.status(400).json({
//             success: false,
//             message: error.message,
//         });

//     }

// };