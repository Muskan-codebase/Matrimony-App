"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const onBoarding_routes_1 = require("../modules/onBoarding/onBoarding.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const profile_routes_1 = require("../modules/profile-details/profile.routes");
const location_routes_1 = require("../modules/admin/location/location.routes");
const qualification_routes_1 = require("../modules/admin/qualification/qualification.routes");
const height_routes_1 = require("../modules/admin/height/height.routes");
const adminAuth_routes_1 = require("../modules/admin/admin-auth/adminAuth.routes");
const motherTongue_routes_1 = require("../modules/admin/mother-tongue/motherTongue.routes");
const annualIncome_routes_1 = require("../modules/admin/annual-income/annualIncome.routes");
const interest_routes_1 = require("../modules/profile-details/interest/interest.routes");
const religion_routes_1 = require("../modules/admin/religion/religion.routes");
const caste_routes_1 = require("../modules/admin/religion/caste/caste.routes");
const subCaste_routes_1 = require("../modules/admin/religion/caste/sub-caste/subCaste.routes");
const shortlist_routes_1 = require("../modules/profile-details/shortlist/shortlist.routes");
const ignore_routes_1 = require("../modules/profile-details/ignore/ignore.routes");
const block_routes_1 = require("../modules/profile-details/block/block.routes");
const profileVisits_routes_1 = require("../modules/profile-details/profile-visits/profileVisits.routes");
const package_routes_1 = require("../modules/package/package.routes");
const accountSettings_routes_1 = require("../modules/account-settings/accountSettings.routes");
const partnerPreference_routes_1 = require("../modules/profile-details/partner-preference/partnerPreference.routes");
const occupation_routes_1 = require("../modules/admin/occupation/occupation.routes");
const successStory_routes_1 = require("../modules/success-story/successStory.routes");
const chat_routes_1 = require("../modules/profile-details/chat/chat.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const faq_routes_1 = require("../modules/admin/faq/faq.routes");
const heroBanner_routes_1 = require("../modules/admin/hero-banner/heroBanner.routes");
const aboutUs_routes_1 = require("../modules/admin/about-us/aboutUs.routes");
const notification_routes_1 = require("../modules/profile-details/notification/notification.routes");
const call_routes_1 = require("../modules/profile-details/call/call.routes");
// import { profileVisitsRouter } from '../modules/profile-details/profile-visits/profileVisits.routes';
const profileVerification_routes_1 = require("../modules/profile-details/profile-verification/profileVerification.routes");
const reportProfile_routes_1 = require("../modules/profile-details/report-profile/reportProfile.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/on-boarding',
        route: onBoarding_routes_1.onboardingRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.authRouter
    },
    {
        path: "/profile",
        route: profile_routes_1.profileRouter
    },
    {
        path: "/interest",
        route: interest_routes_1.interestRouter
    },
    {
        path: "/shortlist",
        route: shortlist_routes_1.shortlistedRouter
    },
    {
        path: "/ignore",
        route: ignore_routes_1.ignoreRouter
    },
    {
        path: "/block",
        route: block_routes_1.blockRouter
    },
    {
        path: "/profile-visits",
        route: profileVisits_routes_1.profileVisitsRouter
    },
    {
        path: "/partner-preference",
        route: partnerPreference_routes_1.partnerPreferenceRouter
    },
    {
        path: "/admin/location",
        route: location_routes_1.locationRouter
    },
    {
        path: "/admin/qualification",
        route: qualification_routes_1.qualificationRouter
    },
    {
        path: "/admin/religion",
        route: religion_routes_1.religionRouter
    },
    {
        path: "/admin/mother-tongue",
        route: motherTongue_routes_1.motherTongueRouter
    },
    {
        path: "/admin/height",
        route: height_routes_1.heightRouter
    },
    {
        path: "/admin/auth",
        route: adminAuth_routes_1.adminAuthRouter
    },
    {
        path: "/admin/annual-income",
        route: annualIncome_routes_1.annualIncomeRouter
    },
    {
        path: "/admin/religion",
        route: religion_routes_1.religionRouter
    },
    {
        path: "/admin/caste",
        route: caste_routes_1.casteRouter,
    },
    {
        path: "/admin/sub-caste",
        route: subCaste_routes_1.subCasteRouter
    },
    {
        path: "/admin/package",
        route: package_routes_1.packageRouter
    },
    {
        path: "/admin/occupation",
        route: occupation_routes_1.occupationRouter
    },
    {
        path: "/account-settings",
        route: accountSettings_routes_1.accountSettingsRouter
    },
    {
        path: "/success-stories",
        route: successStory_routes_1.successStoryRouter
    },
    {
        path: "/chat",
        route: chat_routes_1.chatRouter
    },
    {
        path: "/payment",
        route: payment_routes_1.paymentRouter
    },
    {
        path: "/faqs",
        route: faq_routes_1.faqRouter
    },
    {
        path: "/hero-banner",
        route: heroBanner_routes_1.heroBannerRouter
    },
    {
        path: "/about-us",
        route: aboutUs_routes_1.aboutUsRouter
    },
    {
        path: "/notification",
        route: notification_routes_1.notificationRouter
    },
    {
        path: "/call",
        route: call_routes_1.callRouter
    },
    {
        path: "/profile-verification",
        route: profileVerification_routes_1.profileVerificationRouter
    },
    {
        path: "/profile-report",
        route: reportProfile_routes_1.reportProfileRouter
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
