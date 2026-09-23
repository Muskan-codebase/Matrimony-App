"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAction = exports.ReportStatus = void 0;
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "pending";
    ReportStatus["RESOLVED"] = "resolved";
    ReportStatus["REJECTED"] = "rejected";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
var AdminAction;
(function (AdminAction) {
    AdminAction["NONE"] = "none";
    AdminAction["BLOCKED"] = "blocked";
    AdminAction["DISMISSED"] = "dismissed";
})(AdminAction || (exports.AdminAction = AdminAction = {}));
