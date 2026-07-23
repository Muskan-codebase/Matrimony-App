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
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
