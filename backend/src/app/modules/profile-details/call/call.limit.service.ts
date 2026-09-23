import '../../../config/firebase';
import { getFirestore } from 'firebase-admin/firestore';
import { Profile } from '../profile.model';
import PackageModel from '../../package/package.model';

const db = getFirestore();

// Users with no active package can place a limited number of calls per
// day — same idea as FREE_DAILY_INTEREST_LIMIT in interest.controllers.ts.
const FREE_DAILY_CALL_LIMIT = 3;

export interface CallLimitResult {
  allowed: boolean;
  message?: string;
}

/**
 * Counts calls initiated (senderId) by this profile in Firestore's
 * `calls` collection since a given date.
 */
const countCallsSince = async (
  profileId: string,
  since: Date,
): Promise<number> => {
  const snapshot = await db
    .collection('calls')
    .where('senderId', '==', profileId)
    .where('createdAt', '>=', since)
    .get();

  return snapshot.size;
};

export const checkCallLimit = async (
  profileId: string,
): Promise<CallLimitResult> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const profile = await Profile.findById(profileId).select('subscription');

  if (!profile) {
    return { allowed: false, message: 'Profile not found.' };
  }

  const subscription = profile.subscription;

  const isExpired =
    !subscription?.packageId ||
    !subscription?.expiryDate ||
    new Date(subscription.expiryDate) < new Date();

  // --------------------------------------------------
  // NO ACTIVE PACKAGE — free tier
  // --------------------------------------------------
  if (isExpired) {
    const todayCallCount = await countCallsSince(profileId, today);

    if (todayCallCount >= FREE_DAILY_CALL_LIMIT) {
      return {
        allowed: false,
        message: `You can only make ${FREE_DAILY_CALL_LIMIT} calls per day. Please upgrade your package to make more calls.`,
      };
    }

    return { allowed: true };
  }

  // --------------------------------------------------
  // ACTIVE PACKAGE
  // --------------------------------------------------
  const packageData = await PackageModel.findById(subscription.packageId);

  if (!packageData) {
    return {
      allowed: false,
      message: 'Package associated with your subscription was not found.',
    };
  }

  // Package documents created before calling existed default these to
  // 9999 (see package.model.ts), so old packages stay effectively
  // unlimited until an admin sets real values.
  const callLimit = packageData.callLimit ?? 9999;
  const dailyCallLimit = packageData.dailyCallLimit ?? 9999;

  const packageStartDate = subscription.startDate
    ? new Date(subscription.startDate)
    : today;

  const totalCallCount = await countCallsSince(profileId, packageStartDate);

  if (totalCallCount >= callLimit) {
    return {
      allowed: false,
      message: `You have reached your total limit of ${callLimit} calls for this package.`,
    };
  }

  const todayCallCount = await countCallsSince(profileId, today);

  if (todayCallCount >= dailyCallLimit) {
    return {
      allowed: false,
      message: `You can only make ${dailyCallLimit} calls per day with your current package.`,
    };
  }

  return { allowed: true };
};
