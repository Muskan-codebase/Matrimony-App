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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPhotoRequest = void 0;
const profile_model_1 = require("../profile.model");
const email_service_1 = require("../../../services/email.service");
const email_templates_1 = require("../../../services/email.templates");
const sendPhotoRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { receiverId } = req.body;
        // ==========================================
        // Validate request
        // ==========================================
        if (!senderId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });
        }
        // ==========================================
        // Prevent requesting own photo
        // ==========================================
        if (senderId.toString() === receiverId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot request your own photo",
            });
        }
        // ==========================================
        // Get sender and receiver profiles
        // ==========================================
        const [senderProfile, receiverProfile] = yield Promise.all([
            profile_model_1.Profile.findOne({
                userId: senderId,
                isDeleted: false,
                isBlocked: false,
            }),
            profile_model_1.Profile.findOne({
                userId: receiverId,
                isDeleted: false,
                isBlocked: false,
            }),
        ]);
        if (!senderProfile) {
            return res.status(404).json({
                success: false,
                message: "Sender profile not found",
            });
        }
        if (!receiverProfile) {
            return res.status(404).json({
                success: false,
                message: "Receiver profile not found",
            });
        }
        // ==========================================
        // Check receiver's photo
        // ==========================================
        if (receiverProfile.photos &&
            receiverProfile.photos.length > 0) {
            return res.status(400).json({
                success: false,
                message: "This user has already uploaded a photo",
            });
        }
        // ==========================================
        // Get receiver email
        // ==========================================
        const receiverEmail = (_b = receiverProfile.contactDetails) === null || _b === void 0 ? void 0 : _b.email;
        if (!receiverEmail) {
            return res.status(400).json({
                success: false,
                message: "Receiver email address not found",
            });
        }
        // ==========================================
        // Get sender name
        // ==========================================
        const senderName = [
            (_c = senderProfile.basicDetails) === null || _c === void 0 ? void 0 : _c.firstName,
            (_d = senderProfile.basicDetails) === null || _d === void 0 ? void 0 : _d.lastName,
        ]
            .filter(Boolean)
            .join(" ");
        const receiverFirstName = ((_e = receiverProfile.basicDetails) === null || _e === void 0 ? void 0 : _e.firstName) || "User";
        // ==========================================
        // Send email
        // ==========================================
        yield (0, email_service_1.sendEmail)({
            to: receiverEmail,
            name: receiverFirstName,
            subject: "Photo Request - SahaJeevan",
            html: (0, email_templates_1.photoRequestEmail)(receiverFirstName, senderName || "A SahaJeevan member"),
        });
        // ==========================================
        // Response
        // ==========================================
        return res.status(200).json({
            success: true,
            message: "Photo request sent successfully",
        });
    }
    catch (error) {
        console.error("Send photo request error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send photo request",
        });
    }
});
exports.sendPhotoRequest = sendPhotoRequest;
