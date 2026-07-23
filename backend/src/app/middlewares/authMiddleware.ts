import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/verifyJWT";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyAccessToken(token);

        req.user = decoded;

        next();

    } catch {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });

    }

};