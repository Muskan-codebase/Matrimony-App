import { Request, Response } from "express";
import bcrypt from "bcrypt";

import Auth from "../../auth/auth.model";
import {
    adminLoginValidation,
    adminLogoutValidation,
    adminRefreshTokenValidation,
} from "./adminAuth.validation";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../../utils/generateJWT";
import { verifyRefreshToken } from "../../../utils/verifyJWT";
import { UserRole } from "../../auth/auth.interface";

export const loginAdmin = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData = adminLoginValidation.parse({
            body: req.body,
        });

        const { email, password } = validatedData.body;

        const admin = await Auth.findOne({
            email,
            role: UserRole.ADMIN,
            isDeleted: false,
        });

        if (!admin) {

            return res.status(404).json({
                success: false,
                message: "Invalid email or password.",
            });

        }

        const isPasswordMatched = await bcrypt.compare(
            password,
            admin.password!
        );

        if (!isPasswordMatched) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });

        }

        const accessToken = generateAccessToken(admin);

        const refreshToken = generateRefreshToken(admin);

        admin.refreshToken = refreshToken;

        admin.lastLogin = new Date();

        admin.loginCount += 1;

        await admin.save();

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

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

export const refreshAdminToken = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData =
            adminRefreshTokenValidation.parse({
                body: req.body,
            });

        const { refreshToken } = validatedData.body;

        const decoded = verifyRefreshToken(refreshToken);

        const admin = await Auth.findOne({

            _id: decoded.id,

            role: UserRole.ADMIN,

            refreshToken,

            isDeleted: false,

        });

        if (!admin) {

            return res.status(401).json({

                success: false,

                message: "Invalid refresh token.",

            });

        }

        const accessToken = generateAccessToken(admin);

        return res.status(200).json({

            success: true,

            message: "Access token generated successfully.",

            data: {

                accessToken,

            },

        });

    }

    catch (error: any) {

        return res.status(401).json({

            success: false,

            message: "Invalid or expired refresh token.",

        });

    }

};

export const logoutAdmin = async (
    req: Request,
    res: Response
) => {

    try {

        const validatedData =
            adminLogoutValidation.parse({
                body: req.body,
            });

        const { refreshToken } = validatedData.body;

        const decoded = verifyRefreshToken(refreshToken);

        const admin = await Auth.findOne({

            _id: decoded.id,

            role: UserRole.ADMIN,

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

        await admin.save();

        return res.status(200).json({

            success: true,

            message: "Admin logged out successfully.",

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

export const getCurrentAdmin = async (
    req: Request,
    res: Response
) => {

    try {

        const admin = await Auth.findOne({

            _id: req.user.id,

            role: UserRole.ADMIN,

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

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};