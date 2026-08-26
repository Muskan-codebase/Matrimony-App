import { Request, Response } from "express";
import { Profile } from "../profile.model";
import { sendEmail } from "../../../services/email.service";
import { photoRequestEmail } from "../../../services/email.templates";

export const sendPhotoRequest = async (
    req: Request,
    res: Response
) => {
    try {
        const senderId = req.user?.id;
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

        const [senderProfile, receiverProfile] = await Promise.all([
            Profile.findOne({
                userId: senderId,
                isDeleted: false,
                isBlocked: false,
            }),

            Profile.findOne({
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

        if (
            receiverProfile.photos &&
            receiverProfile.photos.length > 0
        ) {
            return res.status(400).json({
                success: false,
                message: "This user has already uploaded a photo",
            });
        }

        // ==========================================
        // Get receiver email
        // ==========================================

        const receiverEmail =
            receiverProfile.contactDetails?.email;

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
            senderProfile.basicDetails?.firstName,
            senderProfile.basicDetails?.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        const receiverFirstName =
            receiverProfile.basicDetails?.firstName || "User";

        // ==========================================
        // Send email
        // ==========================================

        await sendEmail({
            to: receiverEmail,
            name: receiverFirstName,
            subject: "Photo Request - SahaJeevan",
            html: photoRequestEmail(
                receiverFirstName,
                senderName || "A SahaJeevan member"
            ),
        });

        // ==========================================
        // Response
        // ==========================================

        return res.status(200).json({
            success: true,
            message: "Photo request sent successfully",
        });

    } catch (error) {
        console.error("Send photo request error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send photo request",
        });
    }
};