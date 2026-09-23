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
exports.getCurrentAdmin = exports.logoutAdmin = exports.refreshAdminToken = exports.loginAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_model_1 = __importDefault(require("../../auth/auth.model"));
const adminAuth_validation_1 = require("./adminAuth.validation");
const generateJWT_1 = require("../../../utils/generateJWT");
const verifyJWT_1 = require("../../../utils/verifyJWT");
const auth_interface_1 = require("../../auth/auth.interface");
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = adminAuth_validation_1.adminLoginValidation.parse({
            body: req.body,
        });
        const { email, password } = validatedData.body;
        const admin = yield auth_model_1.default.findOne({
            email,
            role: auth_interface_1.UserRole.ADMIN,
            isDeleted: false,
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password.",
            });
        }
        const isPasswordMatched = yield bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }
        const accessToken = (0, generateJWT_1.generateAccessToken)(admin);
        const refreshToken = (0, generateJWT_1.generateRefreshToken)(admin);
        admin.refreshToken = refreshToken;
        admin.lastLogin = new Date();
        admin.loginCount += 1;
        yield admin.save();
        return res.status(200).json({
            success: true,
            message: "Admin logged in successfully.",
            data: {
                admin: {
                    id: admin._id,
                    email: admin.email,
                    role: admin.role,
                },
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.loginAdmin = loginAdmin;
const refreshAdminToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = adminAuth_validation_1.adminRefreshTokenValidation.parse({
            body: req.body,
        });
        const { refreshToken } = validatedData.body;
        const decoded = (0, verifyJWT_1.verifyRefreshToken)(refreshToken);
        const admin = yield auth_model_1.default.findOne({
            _id: decoded.id,
            role: auth_interface_1.UserRole.ADMIN,
            refreshToken,
            isDeleted: false,
        });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token.",
            });
        }
        const accessToken = (0, generateJWT_1.generateAccessToken)(admin);
        return res.status(200).json({
            success: true,
            message: "Access token generated successfully.",
            data: {
                accessToken,
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
exports.refreshAdminToken = refreshAdminToken;
const logoutAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = adminAuth_validation_1.adminLogoutValidation.parse({
            body: req.body,
        });
        const { refreshToken } = validatedData.body;
        const decoded = (0, verifyJWT_1.verifyRefreshToken)(refreshToken);
        const admin = yield auth_model_1.default.findOne({
            _id: decoded.id,
            role: auth_interface_1.UserRole.ADMIN,
            refreshToken,
            isDeleted: false,
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found.",
            });
        }
        admin.refreshToken = undefined;
        yield admin.save();
        return res.status(200).json({
            success: true,
            message: "Admin logged out successfully.",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.logoutAdmin = logoutAdmin;
const getCurrentAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield auth_model_1.default.findOne({
            _id: req.user.id,
            role: auth_interface_1.UserRole.ADMIN,
            isDeleted: false,
        }).select("-password -refreshToken");
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: admin,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getCurrentAdmin = getCurrentAdmin;
