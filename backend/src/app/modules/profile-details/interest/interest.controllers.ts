import { Request, Response } from "express";
import { Interest } from "./interest.model";
import { Profile } from "../profile.model";
import { Shortlist } from "../shortlist/shortlist.model";
import ProfileVisit from "../profile-visits/profileVisits.model";
import {
    createInterestSchema,
} from "./interest.validation";
import { sendNotification } from "../../../services/sendNotification.service";
import { Payment } from "../../payment/payment.model";

// Free users can send maximum 15 interest requests per day
const FREE_DAILY_INTEREST_LIMIT = 15;

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

        // If interest was already sent and is still active
        if (existingInterest && existingInterest.status !== "Withdrawn") {
            return res.status(409).json({
                success: false,
                message: "Interest already sent.",
            });
        }

        // --------------------------------------------------
        // GET LATEST SUCCESSFUL PAYMENT
        // --------------------------------------------------

        const payment = await Payment.findOne({
            userId: req.user.id,
            status: "SUCCESS",
        })
            .sort({ paidAt: -1 })
            .populate("packageId");

        // --------------------------------------------------
        // CALCULATE TODAY'S START
        // --------------------------------------------------

        const today = new Date();

        today.setHours(0, 0, 0, 0);


        // --------------------------------------------------
        // NO PACKAGE
        // --------------------------------------------------

        if (!payment) {

            const todayInterestCount =
                await Interest.countDocuments({
                    senderId: senderProfile._id,
                    isDeleted: false,
                    createdAt: {
                        $gte: today,
                    },
                });


            if (todayInterestCount >= FREE_DAILY_INTEREST_LIMIT) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You can only send 15 interest requests per day. Please try again tomorrow.",
                });
            }
        }

        // --------------------------------------------------
        // PACKAGE USER
        // --------------------------------------------------

        if (payment) {

            if (!payment.paidAt) {
                return res.status(400).json({
                    success: false,
                    message: "Payment date is missing.",
                });
            }


            const packageData: any = payment.packageId;


            if (!packageData) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Package associated with your payment was not found.",
                });
            }


            // --------------------------------------------------
            // CHECK PACKAGE EXPIRY
            // --------------------------------------------------

            const expiryDate = new Date(payment.paidAt);


            if (packageData.durationType === "DAY") {
                expiryDate.setDate(
                    expiryDate.getDate() + packageData.duration
                );
            }


            if (packageData.durationType === "MONTH") {
                expiryDate.setMonth(
                    expiryDate.getMonth() + packageData.duration
                );
            }


            if (packageData.durationType === "YEAR") {
                expiryDate.setFullYear(
                    expiryDate.getFullYear() + packageData.duration
                );
            }


            // Package expired
            if (new Date() > expiryDate) {

                // Treat expired package user as a free user
                const todayInterestCount =
                    await Interest.countDocuments({
                        senderId: senderProfile._id,
                        isDeleted: false,
                        createdAt: {
                            $gte: today,
                        },
                    });


                if (todayInterestCount >= FREE_DAILY_INTEREST_LIMIT) {
                    return res.status(403).json({
                        success: false,
                        message:
                            "You can only send 15 interest requests per day. Please try again tomorrow.",
                    });
                }

            } else {

                // --------------------------------------------------
                // ACTIVE PACKAGE
                // --------------------------------------------------

                const packageStartDate = new Date(payment.paidAt);


                // Count total interests sent during this package
                const totalInterestCount =
                    await Interest.countDocuments({
                        senderId: senderProfile._id,
                        isDeleted: false,
                        createdAt: {
                            $gte: packageStartDate,
                        },
                    });


                // Check total package limit
                if (
                    totalInterestCount >=
                    packageData.interestRequestLimit
                ) {
                    return res.status(403).json({
                        success: false,
                        message: `You have reached your total limit of ${packageData.interestRequestLimit} interest requests for this package.`,
                    });
                }


                // --------------------------------------------------
                // COUNT TODAY'S INTEREST REQUESTS
                // --------------------------------------------------

                const todayInterestCount =
                    await Interest.countDocuments({
                        senderId: senderProfile._id,
                        isDeleted: false,
                        createdAt: {
                            $gte: today,
                        },
                    });


                // Check daily package limit
                if (
                    todayInterestCount >=
                    packageData.dailyInterestRequestLimit
                ) {
                    return res.status(403).json({
                        success: false,
                        message: `You can only send ${packageData.dailyInterestRequestLimit} interest requests per day with your current package.`,
                    });
                }
            }
        }


        // Create new interest or re-send withdrawn interest
        let interest;

        if (existingInterest && existingInterest.status === "Withdrawn") {

            interest = await Interest.findByIdAndUpdate(
                existingInterest._id,
                {
                    status: "Pending",
                },
                {
                    new: true,
                }
            );

        } else {

            interest = await Interest.create({
                senderId: senderProfile._id,
                receiverId: validatedData.body.receiverId,
                status: "Pending",
            });
        }

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
        const populatedInterest = await Interest.findById(interest?._id)
            .populate("senderId")
            .populate("receiverId");

        // Send notification
        await sendNotification({
            receiverId: receiverProfile.userId.toString(),
            title: "New Interest Request",
            body: `${senderProfile.basicDetails.firstName} sent you an interest request.`,
            data: {
                type: "interest",
                interestId: interest?.id.toString(),
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

        const senderProfile = await Profile.findById(interest.senderId);

        if (!senderProfile) {
            return res.status(404).json({
                success: false,
                message: "Sender profile not found.",
            });
        }

        await sendNotification({
            receiverId: senderProfile.userId.toString(),
            title: "Interest Accepted",
            body: `${loggedInProfile.basicDetails.firstName} accepted your interest request.`,
            data: {
                type: "interest_accepted",
                interestId: interest.id,
            },
        });

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