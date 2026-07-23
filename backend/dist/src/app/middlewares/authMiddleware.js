"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const verifyJWT_1 = require("../utils/verifyJWT");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, verifyJWT_1.verifyAccessToken)(token);
        req.user = decoded;
        next();
    }
    catch (_a) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};
exports.authenticate = authenticate;
