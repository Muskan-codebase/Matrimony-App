import { Request, Response } from "express";
import mongoose from "mongoose";
import { Profile } from "../profile.model";
import { ProfileReport } from "./reportProfile.model";
import { ReportStatus } from "./reportProfile.interface";

export const reportProfile = async (
    req: Request,
    res: Response
) => {
    try {
        const reporterId = req.user.id;

        const profile = await Profile.findOne({
            userId: reporterId
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Reporter profile not found",
            });
        }

        const reporterProfileId = profile?.id;
        console.log(reporterProfileId);

        const reportedProfileId = req.params.profileId;
        const { reason } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(reportedProfileId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile ID",
            });
        }

        // User cannot report themselves
        if (
            reporterProfileId?.toString() ===
            reportedProfileId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot report your own profile",
            });
        }

        // Check reported profile
        const reportedProfile = await Profile.findById(
            reportedProfileId
        ).select("_id isBlocked");

        if (!reportedProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        // Already permanently blocked
        if (reportedProfile.isBlocked) {
            return res.status(400).json({
                success: false,
                message: "This profile is no longer available",
            });
        }

        // Check existing pending report
        const existingReport = await ProfileReport.findOne({
            reporterId: reporterProfileId,
            reportedProfileId,
            status: ReportStatus.PENDING,
        });

        if (existingReport) {
            return res.status(400).json({
                success: false,
                message: "You have already reported this profile",
            });
        }

        // Create report
        const report = await ProfileReport.create({
            reporterId: reporterProfileId,
            reportedProfileId,
            reason,
            status: ReportStatus.PENDING,
        });

        return res.status(201).json({
            success: true,
            message: "Profile reported successfully",
            data: {
                reportId: report._id,
            },
        });
    } catch (error) {
        console.error("Report Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while reporting the profile",
        });
    }
};

export const getProfileReports = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            status = ReportStatus.PENDING,
            page = 1,
            limit = 10,
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const skip = (pageNumber - 1) * limitNumber;

        const filter: any = {};

        if (status) {
            filter.status = status;
        }

        const [reports, total] = await Promise.all([
            ProfileReport.find(filter)
                .populate(
                    "reporterId",
                    "basicDetails.firstName basicDetails.lastName matrimonyId profilePhoto"
                )
                .populate(
                    "reportedProfileId",
                    "basicDetails.firstName basicDetails.lastName matrimonyId profilePhoto isBlocked"
                )
                .populate(
                    "adminId",
                    "name email"
                )
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),

            ProfileReport.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Profile reports fetched successfully",
            data: reports,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error) {
        console.error("Get Profile Reports Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching reports",
        });
    }
};

export const getProfileReportById = async (
    req: Request,
    res: Response
) => {
    try {
        const { reportId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }

        const report = await ProfileReport.findById(reportId)
            .populate(
                "reporterId",
                "basicDetails.firstName basicDetails.lastName matrimonyId profilePhoto"
            )
            .populate(
                "reportedProfileId",
                "basicDetails.firstName basicDetails.lastName matrimonyId profilePhoto isBlocked"
            )
            .populate(
                "adminId",
                "name email"
            );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Report fetched successfully",
            data: report,
        });
    } catch (error) {
        console.error("Get Profile Report Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the report",
        });
    }
};

export const blockReportedProfile = async (
    req: Request,
    res: Response
) => {
    try {
        const { reportId } = req.params;
        const adminId = req.user.id;

        const { adminNote } = req.body;

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }

        const report = await ProfileReport.findById(reportId);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        // Already resolved
        if (report.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "This report has already been resolved",
            });
        }

        // Find reported profile
        const profile = await Profile.findById(
            report.reportedProfileId
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Reported profile not found",
            });
        }

        // Permanently block profile
        await Profile.findByIdAndUpdate(
            report.reportedProfileId,
            {
                $set: {
                    isBlocked: true,
                    blockedAt: new Date(),
                    blockedBy: adminId,
                    blockReason: report.reason,
                },
            }
        );

        // Resolve current report
        await ProfileReport.findByIdAndUpdate(
            report._id,
            {
                $set: {
                    status: "resolved",
                    adminAction: "blocked",
                    adminId,
                    adminNote: adminNote || null,
                    resolvedAt: new Date(),
                },
            }
        );

        // Resolve all other pending reports
        // against the same profile
        await ProfileReport.updateMany(
            {
                reportedProfileId: report.reportedProfileId,
                status: "pending",
                _id: { $ne: report._id },
            },
            {
                $set: {
                    status: "resolved",
                    adminAction: "blocked",
                    adminId,
                    adminNote:
                        "Profile permanently blocked by admin",
                    resolvedAt: new Date(),
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Profile permanently blocked successfully",
        });
    } catch (error) {
        console.error("Block Reported Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while blocking the profile",
        });
    }
};

export const dismissProfileReport = async (
    req: Request,
    res: Response
) => {
    try {
        const { reportId } = req.params;
        const adminId = req.user.id;

        const { adminNote } = req.body;

        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }

        const report = await ProfileReport.findById(reportId);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        if (report.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "This report has already been resolved",
            });
        }

        await ProfileReport.findByIdAndUpdate(
            reportId,
            {
                $set: {
                    status: "resolved",
                    adminAction: "dismissed",
                    adminId,
                    adminNote: adminNote || null,
                    resolvedAt: new Date(),
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Report dismissed successfully",
        });
    } catch (error) {
        console.error("Dismiss Profile Report Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while dismissing the report",
        });
    }
};