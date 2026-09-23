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
exports.startMembershipExpiryJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const profile_model_1 = require("../modules/profile-details/profile.model");
const accountSettings_model_1 = require("../modules/account-settings/accountSettings.model");
const email_service_1 = require("../services/email.service");
const startMembershipExpiryJob = () => {
    // Runs every hour
    node_cron_1.default.schedule("0 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const now = new Date();
            // Find memberships expiring within the next 24 hours
            const next24Hours = new Date(now);
            next24Hours.setHours(next24Hours.getHours() + 24);
            const profiles = yield profile_model_1.Profile.find({
                "subscription.isActive": true,
                "subscription.expiryDate": {
                    $gte: now,
                    $lte: next24Hours,
                },
            }).lean();
            for (const profile of profiles) {
                const userId = profile.userId;
                // Check email notification setting
                const settings = yield accountSettings_model_1.AccountSettings.findOne({
                    userId,
                    isDeleted: false,
                }).lean();
                if (((_b = (_a = settings === null || settings === void 0 ? void 0 : settings.notificationSettings) === null || _a === void 0 ? void 0 : _a.emailNotifications) === null || _b === void 0 ? void 0 : _b.membershipMails) === false) {
                    continue;
                }
                // Get user's email
                const userProfile = yield profile_model_1.Profile.findById(userId).lean();
                if (!((_c = userProfile === null || userProfile === void 0 ? void 0 : userProfile.contactDetails) === null || _c === void 0 ? void 0 : _c.email)) {
                    continue;
                }
                const expiryDate = (_d = profile.subscription) === null || _d === void 0 ? void 0 : _d.expiryDate;
                if (!expiryDate) {
                    continue;
                }
                yield (0, email_service_1.sendEmail)({
                    to: (_e = userProfile === null || userProfile === void 0 ? void 0 : userProfile.contactDetails) === null || _e === void 0 ? void 0 : _e.email,
                    name: (_f = userProfile === null || userProfile === void 0 ? void 0 : userProfile.basicDetails) === null || _f === void 0 ? void 0 : _f.firstName,
                    subject: "Your SahaJeevan Membership is Expiring",
                    html: `
                        <h2>Membership Expiry Reminder</h2>

                        <p>
                            Hi ${((_g = userProfile === null || userProfile === void 0 ? void 0 : userProfile.basicDetails) === null || _g === void 0 ? void 0 : _g.firstName) || "User"},
                        </p>

                        <p>
                            Your SahaJeevan membership will
                            expire on
                            <strong>
                                ${new Date(expiryDate).toLocaleDateString()}
                            </strong>.
                        </p>

                        <p>
                            Renew your membership to continue
                            enjoying SahaJeevan's premium features.
                        </p>

                        <p>
                            Regards,<br>
                            SahaJeevan Team
                        </p>
                    `,
                });
            }
        }
        catch (error) {
            console.error("Membership expiry email job error:", error);
        }
    }));
};
exports.startMembershipExpiryJob = startMembershipExpiryJob;
