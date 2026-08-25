import { Router } from 'express';
import { onboardingRoutes } from '../modules/onBoarding/onBoarding.routes';
import { authRouter } from '../modules/auth/auth.routes';
import { profileRouter } from '../modules/profile-details/profile.routes';
import { locationRouter } from '../modules/admin/location/location.routes';
import { qualificationRouter } from '../modules/admin/qualification/qualification.routes';
import { heightRouter } from '../modules/admin/height/height.routes';
import { adminAuthRouter } from '../modules/admin/admin-auth/adminAuth.routes';
import { motherTongueRouter } from '../modules/admin/mother-tongue/motherTongue.routes';
import { annualIncomeRouter } from '../modules/admin/annual-income/annualIncome.routes';
import { interestRouter } from '../modules/profile-details/interest/interest.routes';
import { religionRouter } from '../modules/admin/religion/religion.routes';
import { casteRouter } from '../modules/admin/religion/caste/caste.routes';
import { subCasteRouter } from '../modules/admin/religion/caste/sub-caste/subCaste.routes';
import { shortlistedRouter } from '../modules/profile-details/shortlist/shortlist.routes';
import { ignoreRouter } from '../modules/profile-details/ignore/ignore.routes';
import { blockRouter } from '../modules/profile-details/block/block.routes';
import { profileVisitsRouter } from '../modules/profile-details/profile-visits/profileVisits.routes';
import { packageRouter } from '../modules/package/package.routes';
import { accountSettingsRouter } from '../modules/account-settings/accountSettings.routes';
import { partnerPreferenceRouter } from '../modules/profile-details/partner-preference/partnerPreference.routes';
import { occupationRouter } from '../modules/admin/occupation/occupation.routes';
import { successStoryRouter } from '../modules/success-story/successStory.routes';
import { chatRouter } from '../modules/profile-details/chat/chat.routes';
import { paymentRouter } from '../modules/payment/payment.routes';
import { faqRouter } from '../modules/admin/faq/faq.routes';
import { heroBannerRouter } from '../modules/admin/hero-banner/heroBanner.routes';
import { aboutUsRouter } from '../modules/admin/about-us/aboutUs.routes';
import { notificationRouter } from '../modules/profile-details/notification/notification.routes';
import { callRouter } from '../modules/profile-details/call/call.routes';
// import { profileVisitsRouter } from '../modules/profile-details/profile-visits/profileVisits.routes';
import { profileVerificationRouter } from '../modules/profile-details/profile-verification/profileVerification.routes';
import { reportProfileRouter } from '../modules/profile-details/report-profile/reportProfile.routes';
import { contactUsRouter } from '../modules/admin/contact-us/contactUs.routes';
import { pressRouter } from '../modules/admin/press/press.routes';
import { privacyPolicyRouter } from '../modules/admin/privacy-policy/privacyPolicy.routes';
import { inAppNotificationsRouter } from '../modules/profile-details/in-app-notifications/inAppNotification.routes';
import { adminProfileRouter } from '../modules/admin/profile/profile.routes';
import { testEmailRouter } from '../services/email.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/on-boarding',
    route: onboardingRoutes,
  },
  {
    path: "/auth",
    route: authRouter
  },
  {
    path: "/profile",
    route: profileRouter
  },
  {
    path: "/interest",
    route: interestRouter
  },
  {
    path: "/shortlist",
    route: shortlistedRouter
  },
  {
    path: "/ignore",
    route: ignoreRouter
  },
  {
    path: "/block",
    route: blockRouter
  },
  {
    path: "/profile-visits",
    route: profileVisitsRouter
  },
  {
    path: "/partner-preference",
    route: partnerPreferenceRouter
  },
  {
    path: "/admin/location",
    route: locationRouter
  },
  {
    path: "/admin/qualification",
    route: qualificationRouter
  },
  {
    path: "/admin/religion",
    route: religionRouter
  },
  {
    path: "/admin/mother-tongue",
    route: motherTongueRouter
  },
  {
    path: "/admin/height",
    route: heightRouter
  },
  {
    path: "/admin/auth",
    route: adminAuthRouter
  },
  {
    path: "/admin/annual-income",
    route: annualIncomeRouter
  },
  {
    path: "/admin/religion",
    route: religionRouter
  },
  {
    path: "/admin/caste",
    route: casteRouter,
  },
  {
    path: "/admin/sub-caste",
    route: subCasteRouter
  },
  {
    path: "/admin/package",
    route: packageRouter
  },
  {
    path: "/admin/occupation",
    route: occupationRouter
  },
  {
    path: "/account-settings",
    route: accountSettingsRouter
  },
  {
    path: "/success-stories",
    route: successStoryRouter
  },
  {
    path: "/chat",
    route: chatRouter
  },
  {
    path: "/payment",
    route: paymentRouter
  },
  {
    path: "/admin/faqs",
    route: faqRouter
  },
  {
    path: "/admin/hero-banner",
    route: heroBannerRouter
  },
  {
    path: "/admin/about-us",
    route: aboutUsRouter
  },
  {
    path: "/notification",
    route: notificationRouter
  },
  {
    path: "/call",
    route: callRouter
  },
  {
    path: "/profile-verification",
    route: profileVerificationRouter
  },
  {
    path: "/profile-report",
    route: reportProfileRouter
  },
  {
    path: "/admin/contact-us",
    route: contactUsRouter
  },
  {
    path: "/admin/press",
    route: pressRouter
  },
  {
    path: "/admin/privacy-policy",
    route: privacyPolicyRouter
  },
  {
    path: "/app-notification",
    route: inAppNotificationsRouter
  },
  {
    path: "/admin/profile",
    route: adminProfileRouter
  },
  {
    path: "/test",
    route: testEmailRouter
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
