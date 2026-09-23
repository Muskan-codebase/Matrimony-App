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
exports.checkCallLimit = void 0;
require("../../../config/firebase");
const firestore_1 = require("firebase-admin/firestore");
const profile_model_1 = require("../profile.model");
const package_model_1 = __importDefault(require("../../package/package.model"));
const db = (0, firestore_1.getFirestore)();
// Users with no active package can place a limited number of calls per
// day — same idea as FREE_DAILY_INTEREST_LIMIT in interest.controllers.ts.
const FREE_DAILY_CALL_LIMIT = 3;
/**
 * Counts calls initiated (senderId) by this profile in Firestore's
 * `calls` collection since a given date.
 */
const countCallsSince = (profileId, since) => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield db
        .collection('calls')
        .where('senderId', '==', profileId)
        .where('createdAt', '>=', since)
        .get();
    return snapshot.size;
});
const checkCallLimit = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const profile = yield profile_model_1.Profile.findById(profileId).select('subscription');
    if (!profile) {
        return { allowed: false, message: 'Profile not found.' };
    }
    const subscription = profile.subscription;
    const isExpired = !(subscription === null || subscription === void 0 ? void 0 : subscription.packageId) ||
        !(subscription === null || subscription === void 0 ? void 0 : subscription.expiryDate) ||
        new Date(subscription.expiryDate) < new Date();
    // --------------------------------------------------
    // NO ACTIVE PACKAGE — free tier
    // --------------------------------------------------
    if (isExpired) {
        const todayCallCount = yield countCallsSince(profileId, today);
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
    const packageData = yield package_model_1.default.findById(subscription.packageId);
    if (!packageData) {
        return {
            allowed: false,
            message: 'Package associated with your subscription was not found.',
        };
    }
    // Package documents created before calling existed default these to
    // 9999 (see package.model.ts), so old packages stay effectively
    // unlimited until an admin sets real values.
    const callLimit = (_a = packageData.callLimit) !== null && _a !== void 0 ? _a : 9999;
    const dailyCallLimit = (_b = packageData.dailyCallLimit) !== null && _b !== void 0 ? _b : 9999;
    const packageStartDate = subscription.startDate
        ? new Date(subscription.startDate)
        : today;
    const totalCallCount = yield countCallsSince(profileId, packageStartDate);
    if (totalCallCount >= callLimit) {
        return {
            allowed: false,
            message: `You have reached your total limit of ${callLimit} calls for this package.`,
        };
    }
    const todayCallCount = yield countCallsSince(profileId, today);
    if (todayCallCount >= dailyCallLimit) {
        return {
            allowed: false,
            message: `You can only make ${dailyCallLimit} calls per day with your current package.`,
        };
    }
    return { allowed: true };
});
exports.checkCallLimit = checkCallLimit;
