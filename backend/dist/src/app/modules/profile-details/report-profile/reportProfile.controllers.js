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
exports.dismissProfileReport = exports.blockReportedProfile = exports.getProfileReportById = exports.getProfileReports = exports.reportProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const profile_model_1 = require("../profile.model");
const reportProfile_model_1 = require("./reportProfile.model");
const reportProfile_interface_1 = require("./reportProfile.interface");
const reportProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reporterId = req.user.id;
        const profile = yield profile_model_1.Profile.findOne({
            userId: reporterId
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Reporter profile not found",
            });
        }
        const reporterProfileId = profile === null || profile === void 0 ? void 0 : profile.id;
        console.log(reporterProfileId);
        const reportedProfileId = req.params.profileId;
        const { reason } = req.body;
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(reportedProfileId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile ID",
            });
        }
        // User cannot report themselves
        if ((reporterProfileId === null || reporterProfileId === void 0 ? void 0 : reporterProfileId.toString()) ===
            reportedProfileId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot report your own profile",
            });
        }
        // Check reported profile
        const reportedProfile = yield profile_model_1.Profile.findById(reportedProfileId).select("_id isBlocked");
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
        const existingReport = yield reportProfile_model_1.ProfileReport.findOne({
            reporterId: reporterProfileId,
            reportedProfileId,
            status: reportProfile_interface_1.ReportStatus.PENDING,
        });
        if (existingReport) {
            return res.status(400).json({
                success: false,
                message: "You have already reported this profile",
            });
        }
        // Create report
        const report = yield reportProfile_model_1.ProfileReport.create({
            reporterId: reporterProfileId,
            reportedProfileId,
            reason,
            status: reportProfile_interface_1.ReportStatus.PENDING,
        });
        return res.status(201).json({
            success: true,
            message: "Profile reported successfully",
            data: {
                reportId: report._id,
            },
        });
    }
    catch (error) {
        console.error("Report Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reporting the profile",
        });
    }
});
exports.reportProfile = reportProfile;
const getProfileReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status = reportProfile_interface_1.ReportStatus.PENDING, page = 1, limit = 10, } = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const filter = {};
        if (status) {
            filter.status = status;
        }
        const [reports, total] = yield Promise.all([
            reportProfile_model_1.ProfileReport.find(filter)
                .populate("reporterId", "basicDetails.firstName basicDetails.lastName matrimonyId profilePhoto")
                .populate("reportedProfileId", "basicDetails.firstName basicDetails.lastName matrimonyId profilePhoto isBlocked")
                .populate("adminId", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            reportProfile_model_1.ProfileReport.countDocuments(filter),
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
    }
    catch (error) {
        console.error("Get Profile Reports Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching reports",
        });
    }
});
exports.getProfileReports = getProfileReports;
const getProfileReportById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reportId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }
        const report = yield reportProfile_model_1.ProfileReport.findById(reportId)
            .populate("reporterId", "basicDetails.firstName basicDetails.lastName matrimonyId profilePhoto")
            .populate("reportedProfileId", "basicDetails.firstName basicDetails.lastName matrimonyId profilePhoto isBlocked")
            .populate("adminId", "name email");
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
    }
    catch (error) {
        console.error("Get Profile Report Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the report",
        });
    }
});
exports.getProfileReportById = getProfileReportById;
const blockReportedProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reportId } = req.params;
        const adminId = req.user.id;
        const { adminNote } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }
        const report = yield reportProfile_model_1.ProfileReport.findById(reportId);
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
        const profile = yield profile_model_1.Profile.findById(report.reportedProfileId);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Reported profile not found",
            });
        }
        // Permanently block profile
        yield profile_model_1.Profile.findByIdAndUpdate(report.reportedProfileId, {
            $set: {
                isBlocked: true,
                blockedAt: new Date(),
                blockedBy: adminId,
                blockReason: report.reason,
            },
        });
        // Resolve current report
        yield reportProfile_model_1.ProfileReport.findByIdAndUpdate(report._id, {
            $set: {
                status: "resolved",
                adminAction: "blocked",
                adminId,
                adminNote: adminNote || null,
                resolvedAt: new Date(),
            },
        });
        // Resolve all other pending reports
        // against the same profile
        yield reportProfile_model_1.ProfileReport.updateMany({
            reportedProfileId: report.reportedProfileId,
            status: "pending",
            _id: { $ne: report._id },
        }, {
            $set: {
                status: "resolved",
                adminAction: "blocked",
                adminId,
                adminNote: "Profile permanently blocked by admin",
                resolvedAt: new Date(),
            },
        });
        return res.status(200).json({
            success: true,
            message: "Profile permanently blocked successfully",
        });
    }
    catch (error) {
        console.error("Block Reported Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while blocking the profile",
        });
    }
});
exports.blockReportedProfile = blockReportedProfile;
const dismissProfileReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reportId } = req.params;
        const adminId = req.user.id;
        const { adminNote } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }
        const report = yield reportProfile_model_1.ProfileReport.findById(reportId);
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
        yield reportProfile_model_1.ProfileReport.findByIdAndUpdate(reportId, {
            $set: {
                status: "resolved",
                adminAction: "dismissed",
                adminId,
                adminNote: adminNote || null,
                resolvedAt: new Date(),
            },
        });
        return res.status(200).json({
            success: true,
            message: "Report dismissed successfully",
        });
    }
    catch (error) {
        console.error("Dismiss Profile Report Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while dismissing the report",
        });
    }
});
exports.dismissProfileReport = dismissProfileReport;
