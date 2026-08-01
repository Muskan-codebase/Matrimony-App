import { Request, Response } from "express";
import { Interest } from "./interest.model";
import { Profile } from "../profile.model";
import { Shortlist } from "../shortlist/shortlist.model";
import ProfileVisit from "../profile-visits/profileVisits.model";
import {
    createInterestSchema,
} from "./interest.validation";
import { sendNotification } from "../../../services/sendNotification.service";

export const sendInterest = async (
    req: Request,
    res: Response
) => {
    try {

        const validatedData = createInterestSchema.parse({
            body: req.body,
        });

        // Get sender profile
        const senderProfile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!senderProfile) {
            return res.status(404).json({
                success: false,
                message: "Sender profile not found.",
            });
        }

        // Cannot send interest to yourself
        if (senderProfile._id.toString() === validatedData.body.receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send interest to yourself.",
            });
        }

        // Check duplicate interest
        const existingInterest = await Interest.findOne({
            senderId: senderProfile._id,
            receiverId: validatedData.body.receiverId,
            isDeleted: false,
        });

        if (existingInterest) {
            return res.status(409).json({
                success: false,
                message: "Interest already sent.",
            });
        }

        // Create interest
        const interest = await Interest.create({
            senderId: senderProfile._id,
            receiverId: validatedData.body.receiverId,
        });

        const receiverProfile = await Profile.findById(validatedData.body.receiverId);

        if (!receiverProfile) {
            return res.status(404).json({
                success: false,
                message: "Receiver profile not found.",
            });
        }

        // Remove profile from shortlist if it exists
        await Shortlist.findOneAndDelete({
            userId: senderProfile._id,
            shortlistedUserId: validatedData.body.receiverId,
        });

        await ProfileVisit.findOneAndDelete({
            viewerProfileId: senderProfile._id,
            visitedProfileId: validatedData.body.receiverId,
        });

        // Populate sender & receiver
        const populatedInterest = await Interest.findById(interest._id)
            .populate("senderId")
            .populate("receiverId");

        // Send notification
        await sendNotification({
            receiverId: receiverProfile.userId.toString(),
            title: "New Interest Request",
            body: `${senderProfile.basicDetails.firstName} sent you an interest request.`,
            data: {
                type: "interest",
                interestId: interest.id.toString(),
            },
        });

        return res.status(201).json({
            success: true,
            message: "Interest sent successfully.",
            data: populatedInterest,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const getSentInterests = async (
    req: Request,
    res: Response
) => {
    try {

        const senderProfile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!senderProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }

        const interests = await Interest.find({
            senderId: senderProfile._id,
            isDeleted: false,
        }).populate("senderId")
            .populate("receiverId");

        return res.status(200).json({
            success: true,
            count: interests.length,
            data: interests,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const getReceivedInterests = async (
    req: Request,
    res: Response
) => {

    try {

        const receiverProfile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!receiverProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }

        const interests = await Interest.find({
            receiverId: receiverProfile._id,
            isDeleted: false,
        })
            .populate("senderId")
            .populate("receiverId");

        return res.status(200).json({

            success: true,

            count: interests.length,

            data: interests,

        });

    }

    catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};

export const acceptInterest = async (
    req: Request,
    res: Response
) => {

    try {

        // Find logged-in user's profile
        const loggedInProfile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!loggedInProfile) {
            return res.status(404).json({
                success: false,
                message: "Your profile was not found.",
            });
        }

        // Accept the interest
        const interest = await Interest.findOneAndUpdate(
            {
                _id: req.params.id,
                receiverId: loggedInProfile._id,
                status: "Pending",
                isDeleted: false,
            },
            {
                $set: {
                    status: "Accepted",
                },
            },
            {
                new: true,
            }
        )
            .populate("senderId")
            .populate("receiverId");

        if (!interest) {
            return res.status(404).json({
                success: false,
                message: "Interest not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Interest accepted successfully.",
            data: interest,
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export const rejectInterest = async (
    req: Request,
    res: Response
) => {

    try {

        const receiverProfile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!receiverProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }

        const interest = await Interest.findOneAndUpdate(
            {
                _id: req.params.id,
                receiverId: receiverProfile._id,
                status: "Pending",
                isDeleted: false,
            },
            {
                status: "Rejected",
            },
            {
                new: true,
            }
        )
            .populate("senderId")
            .populate("receiverId");

        if (!interest) {
            return res.status(404).json({
                success: false,
                message: "Interest not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Interest rejected successfully.",
            data: interest,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

export const withdrawInterest = async (
    req: Request,
    res: Response
) => {

    try {

        const senderProfile = await Profile.findOne({
            userId: req.user.id,
            isDeleted: false,
        });

        if (!senderProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }

        const interest = await Interest.findOneAndUpdate(
            {
                _id: req.params.id,
                senderId: senderProfile._id,
                status: "Pending",
                isDeleted: false,
            },
            {
                status: "Withdrawn",
            },
            {
                new: true,
            }
        )
            .populate("senderId")
            .populate("receiverId");

        if (!interest) {
            return res.status(404).json({
                success: false,
                message: "Interest not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Interest withdrawn successfully.",
            data: interest,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};