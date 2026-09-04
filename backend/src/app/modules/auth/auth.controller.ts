import { Request, Response } from "express";
import Auth from "./auth.model";
import Otp from "./otp/otp.model";
import { Profile } from "../profile-details/profile.model";
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
import { googleLoginValidation } from "./auth.validation";
import { getAuth } from "firebase-admin/auth";
import app from "../../config/firebase";

const auth = getAuth(app);

auth.listUsers(1)
    .then(() => {
        console.log("✅ Firebase Admin authentication is working");
    })
    .catch((error) => {
        console.error("❌ Firebase Admin authentication failed:", error);
    });

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

        // --------------------------------------------------
        // VALIDATE REQUEST
        // --------------------------------------------------

        const validatedData = verifyOtpValidation.parse(req.body);

        const { mobile, countryCode, token } = validatedData;

        // --------------------------------------------------
        // NORMALIZE COUNTRY CODE
        // --------------------------------------------------

        const normalizedCountryCode = countryCode.startsWith("+")
            ? countryCode
            : `+${countryCode}`;

        // --------------------------------------------------
        // NORMALIZE MOBILE NUMBER
        // --------------------------------------------------

        const normalizedMobile = mobile.replace(/\D/g, "");

        // --------------------------------------------------
        // CREATE FULL PHONE NUMBER
        // --------------------------------------------------

        const fullMobileNumber =
            `${normalizedCountryCode}${normalizedMobile}`;

        // --------------------------------------------------
        // VERIFY FIREBASE ID TOKEN
        // --------------------------------------------------

        const decodedToken = await getAuth(app).verifyIdToken(token);

        const firebaseUid = decodedToken.uid;
        const firebasePhone = decodedToken.phone_number;

        // --------------------------------------------------
        // VERIFY MOBILE NUMBER
        // --------------------------------------------------

        if (!firebasePhone) {
            return res.status(401).json({
                success: false,
                message: "Firebase token does not contain a phone number.",
            });
        }

        if (firebasePhone !== fullMobileNumber) {
            return res.status(401).json({
                success: false,
                message: "Mobile number does not match Firebase token.",
            });
        }

        // --------------------------------------------------
        // CHECK WHETHER USER EXISTS
        // --------------------------------------------------

        let auth = await Auth.findOne({
            mobile: normalizedMobile,
            countryCode: normalizedCountryCode,
            isDeleted: false,
        });

        // --------------------------------------------------
        // CREATE NEW USER IF NOT EXISTS
        // --------------------------------------------------

        if (!auth) {

            auth = await Auth.create({
                mobile: normalizedMobile,
                countryCode: normalizedCountryCode,
                firebaseUid,
                isVerified: true,
                loginCount: 1,
                lastLogin: new Date(),
            });

        } else {

            // --------------------------------------------------
            // EXISTING USER
            // --------------------------------------------------

            auth.firebaseUid = firebaseUid;
            auth.isVerified = true;
            auth.loginCount += 1;
            auth.lastLogin = new Date();

        }

        // --------------------------------------------------
        // CHECK PROFILE EXISTENCE
        // --------------------------------------------------

        const profileExists = await Profile.exists({
            userId: auth._id,
        });

        const isNewUser = !profileExists;


        // --------------------------------------------------
        // GENERATE ACCESS TOKEN
        // --------------------------------------------------

        const accessToken = generateAccessToken(auth);


        // --------------------------------------------------
        // GENERATE REFRESH TOKEN
        // --------------------------------------------------

        const refreshToken = generateRefreshToken(auth);


        // --------------------------------------------------
        // HASH & SAVE REFRESH TOKEN
        // --------------------------------------------------

        auth.refreshToken = await bcrypt.hash(refreshToken, 10);

        await auth.save();


        // --------------------------------------------------
        // RESPONSE
        // --------------------------------------------------

        return res.status(200).json({
            success: true,
            message: isNewUser
                ? "Registered successfully."
                : "Logged in successfully.",
            isNewUser,
            accessToken,
            refreshToken,
            user: auth,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const googleLogin = async (req: Request, res: Response) => {

    try {

        // --------------------------------------------------
        // VALIDATE REQUEST
        // --------------------------------------------------

        const validatedData = googleLoginValidation.parse(req.body);
        const { token } = validatedData;

        // --------------------------------------------------
        // VERIFY FIREBASE ID TOKEN
        // --------------------------------------------------

        console.log("TOKEN RECEIVED:", token);

        const decoded = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        );

        console.log("TOKEN AUD:", decoded.aud);
        console.log("TOKEN ISS:", decoded.iss);
        console.log("TOKEN UID:", decoded.sub);

        const tokenParts = token.split(".");

        const header = JSON.parse(
            Buffer.from(tokenParts[0], "base64").toString()
        );

        console.log("TOKEN ALGORITHM:", header.alg);
        console.log("TOKEN KEY ID:", header.kid);

        const decodedToken = await getAuth(app).verifyIdToken(token);

        const firebaseUid = decodedToken.uid;
        const firebaseEmail = decodedToken.email;


        // --------------------------------------------------
        // VERIFY GOOGLE PROVIDER
        // --------------------------------------------------

        const signInProvider = decodedToken.firebase?.sign_in_provider;

        if (signInProvider !== "google.com") {

            return res.status(401).json({
                success: false,
                message: "Firebase token is not from Google authentication.",
            });
        }

        // --------------------------------------------------
        // VERIFY EMAIL
        // --------------------------------------------------

        if (!firebaseEmail) {

            return res.status(401).json({
                success: false,
                message: "Firebase token does not contain an email address.",
            });

        }


        // --------------------------------------------------
        // NORMALIZE EMAIL
        // --------------------------------------------------

        const normalizedEmail = firebaseEmail
            .trim()
            .toLowerCase();


        // --------------------------------------------------
        // CHECK WHETHER USER EXISTS BY FIREBASE UID
        // --------------------------------------------------

        let auth = await Auth.findOne({
            firebaseUid,
            isDeleted: false,
        });


        // --------------------------------------------------
        // CHECK WHETHER USER EXISTS BY EMAIL
        // --------------------------------------------------

        if (!auth) {
            auth = await Auth.findOne({
                email: normalizedEmail,
                isDeleted: false,
            });
        }


        // --------------------------------------------------
        // CREATE NEW USER IF NOT EXISTS
        // --------------------------------------------------

        if (!auth) {

            auth = await Auth.create({
                email: normalizedEmail,
                firebaseUid,
                isVerified: true,
                loginCount: 1,
                lastLogin: new Date(),
            });

        } else {

            // --------------------------------------------------
            // EXISTING USER
            // --------------------------------------------------

            auth.firebaseUid = firebaseUid;
            auth.isVerified = true;
            auth.loginCount += 1;
            auth.lastLogin = new Date();

        }

        // --------------------------------------------------
        // CHECK PROFILE EXISTENCE
        // --------------------------------------------------

        const profileExists = await Profile.exists({
            userId: auth._id,
        });

        const isNewUser = !profileExists;

        // --------------------------------------------------
        // GENERATE ACCESS TOKEN
        // --------------------------------------------------

        const accessToken = generateAccessToken(auth);

        // --------------------------------------------------
        // GENERATE REFRESH TOKEN
        // --------------------------------------------------

        const refreshToken = generateRefreshToken(auth);

        // --------------------------------------------------
        // HASH & SAVE REFRESH TOKEN
        // --------------------------------------------------

        auth.refreshToken = await bcrypt.hash(
            refreshToken,
            10
        );

        await auth.save();

        // --------------------------------------------------
        // RESPONSE
        // --------------------------------------------------

        return res.status(200).json({
            success: true,
            message: isNewUser
                ? "Registered successfully."
                : "Logged in successfully.",

            isNewUser,
            accessToken,
            refreshToken,
            user: auth,

        });

    } catch (error: any) {

        console.error("Google login error:", {
            message: error.message,
            code: error.code,          // e.g. "auth/argument-error", "auth/id-token-expired"
            errorInfo: error.errorInfo,
            stack: error.stack,
        });

        // Don't lump validation errors in with auth errors
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: error.errors?.[0]?.message ?? "Invalid request.",
            });
        }

        if (error.code?.startsWith("auth/")) {
            return res.status(401).json({
                success: false,
                message: "Google authentication failed. Please try again.",
                code: error.code,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
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

export const saveFirebaseUid = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { firebaseUid } = req.body;

        if (!firebaseUid || typeof firebaseUid !== "string") {
            res.status(400).json({
                success: false,
                message: "Firebase UID is required.",
            });
            return;
        }

        const authUser = await Auth.findById(req.user.id);

        if (!authUser) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }

        // Check if this Firebase UID is already linked
        const existingUser = await Auth.findOne({
            firebaseUid,
            _id: { $ne: authUser._id },
        });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "This Firebase UID is already linked to another account.",
            });
            return;
        }

        authUser.firebaseUid = firebaseUid;
        await authUser.save();

        res.status(200).json({
            success: true,
            message: "Firebase UID saved successfully.",
            data: {
                firebaseUid: authUser.firebaseUid,
            },
        });

    } catch (error: any) {
        console.error("Save Firebase UID Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error.",
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