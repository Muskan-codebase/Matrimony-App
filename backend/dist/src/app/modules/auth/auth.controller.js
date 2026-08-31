"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFirebaseUid = exports.getCurrentUser = exports.refreshToken = exports.resendOTP = exports.verifyOTP = exports.sendOTP = void 0;
const auth_model_1 = __importDefault(require("./auth.model"));
const otp_model_1 = __importDefault(require("./otp/otp.model"));
const profile_model_1 = require("../profile-details/profile.model");
const generateOTP_1 = require("../../utils/generateOTP");
const auth_validation_1 = require("./auth.validation");
const generateJWT_1 = require("../../utils/generateJWT");
const auth_constants_1 = require("./auth.constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("firebase-admin/auth");
const firebase_1 = __importDefault(require("../../config/firebase"));
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = auth_validation_1.sendOtpValidation.parse(req.body);
        const { countryCode, mobile } = validatedData;
        let auth = yield auth_model_1.default.findOne({
            mobile,
            isDeleted: false
        });
        // Track whether this number already belongs to a verified user
        const isExistingUser = !!auth && auth.isVerified;
        //if user does not exists, create a new one
        if (!auth) {
            auth = yield auth_model_1.default.create({
                mobile,
                countryCode,
            });
        }
        //generate OTP
        const otp = (0, generateOTP_1.generateOtp)();
        // OTP Expiry (5 Minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        // Invalidate previous unused OTPs
        yield otp_model_1.default.updateMany({
            authId: auth._id,
            isUsed: false,
        }, {
            isUsed: true,
        });
        // Save New OTP
        yield otp_model_1.default.create({
            authId: auth._id,
            otp,
            expiresAt,
        });
        res.status(200).json(Object.assign({ success: true, message: isExistingUser
                ? "OTP sent. Enter it to log in."
                : "OTP sent. Enter it to complete registration.", isExistingUser }, (process.env.NODE_ENV === "development" && { data: { otp } })));
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.sendOTP = sendOTP;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // --------------------------------------------------
        // VALIDATE REQUEST
        // --------------------------------------------------
        const validatedData = auth_validation_1.verifyOtpValidation.parse(req.body);
        const { mobile, token } = validatedData;
        // --------------------------------------------------
        // VERIFY FIREBASE ID TOKEN
        // --------------------------------------------------
        const decodedToken = yield (0, auth_1.getAuth)(firebase_1.default).verifyIdToken(token);
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
        const normalizedMobile = mobile.startsWith("+")
            ? mobile
            : `+91${mobile}`;
        if (firebasePhone !== normalizedMobile) {
            return res.status(401).json({
                success: false,
                message: "Mobile number does not match Firebase token.",
            });
        }
        // --------------------------------------------------
        // CHECK WHETHER USER EXISTS
        // --------------------------------------------------
        let auth = yield auth_model_1.default.findOne({
            mobile,
            isDeleted: false,
        });
        // --------------------------------------------------
        // CREATE NEW USER IF NOT EXISTS
        // --------------------------------------------------
        if (!auth) {
            auth = yield auth_model_1.default.create({
                mobile,
                firebaseUid,
                isVerified: true,
                loginCount: 1,
                lastLogin: new Date(),
            });
        }
        else {
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
        const profileExists = yield profile_model_1.Profile.exists({
            userId: auth._id,
        });
        const isNewUser = !profileExists;
        // --------------------------------------------------
        // GENERATE ACCESS TOKEN
        // --------------------------------------------------
        const accessToken = (0, generateJWT_1.generateAccessToken)(auth);
        // --------------------------------------------------
        // GENERATE REFRESH TOKEN
        // --------------------------------------------------
        const refreshToken = (0, generateJWT_1.generateRefreshToken)(auth);
        // --------------------------------------------------
        // HASH & SAVE REFRESH TOKEN
        // --------------------------------------------------
        auth.refreshToken = yield bcrypt_1.default.hash(refreshToken, 10);
        yield auth.save();
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
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.verifyOTP = verifyOTP;
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = auth_validation_1.resendOtpValidation.parse(req.body);
        const { mobile } = validatedData;
        const auth = yield auth_model_1.default.findOne({
            mobile,
            isDeleted: false,
        });
        if (!auth) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        const latestOtp = yield otp_model_1.default.findOne({
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
        if (latestOtp.resendCount >= auth_constants_1.MAX_RESEND_COUNT) {
            return res.status(429).json({
                success: false,
                message: "Maximum OTP resend limit reached.",
            });
        }
        // 30-second cooldown
        if (latestOtp.lastResendAt) {
            const diff = Date.now() -
                latestOtp.lastResendAt.getTime();
            if (diff <
                auth_constants_1.RESEND_COOLDOWN_SECONDS * 1000) {
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${auth_constants_1.RESEND_COOLDOWN_SECONDS} seconds before requesting another OTP.`,
                });
            }
        }
        // Expire previous OTP
        latestOtp.isUsed = true;
        yield latestOtp.save();
        const otp = (0, generateOTP_1.generateOtp)();
        const expiresAt = new Date(Date.now() +
            auth_constants_1.OTP_EXPIRY_MINUTES *
                60 *
                1000);
        yield otp_model_1.default.create({
            authId: auth._id,
            otp,
            expiresAt,
            resendCount: latestOtp.resendCount + 1,
            lastResendAt: new Date(),
        });
        /**
         * Send SMS here
         */
        return res.status(200).json(Object.assign({ success: true, message: "OTP resent successfully." }, (process.env.NODE_ENV ===
            "development" && { otp })));
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.resendOTP = resendOTP;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = auth_validation_1.refreshTokenValidation.parse(req.body);
        const { refreshToken } = validatedData;
        // Verify Refresh Token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH);
        const auth = yield auth_model_1.default.findById(decoded.id);
        if (!auth || auth.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        // Compare hashed refresh token
        const isValidToken = yield bcrypt_1.default.compare(refreshToken, auth.refreshToken);
        if (!isValidToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token.",
            });
        }
        // Rotate Tokens
        const newAccessToken = (0, generateJWT_1.generateAccessToken)(auth);
        const newRefreshToken = (0, generateJWT_1.generateRefreshToken)(auth);
        auth.refreshToken = yield bcrypt_1.default.hash(newRefreshToken, 10);
        yield auth.save();
        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully.",
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token.",
        });
    }
});
exports.refreshToken = refreshToken;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const auth = yield auth_model_1.default.findById(id);
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
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getCurrentUser = getCurrentUser;
const saveFirebaseUid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseUid } = req.body;
        if (!firebaseUid || typeof firebaseUid !== "string") {
            res.status(400).json({
                success: false,
                message: "Firebase UID is required.",
            });
            return;
        }
        const authUser = yield auth_model_1.default.findById(req.user.id);
        if (!authUser) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }
        // Check if this Firebase UID is already linked
        const existingUser = yield auth_model_1.default.findOne({
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
        yield authUser.save();
        res.status(200).json({
            success: true,
            message: "Firebase UID saved successfully.",
            data: {
                firebaseUid: authUser.firebaseUid,
            },
        });
    }
    catch (error) {
        console.error("Save Firebase UID Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});
exports.saveFirebaseUid = saveFirebaseUid;
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
