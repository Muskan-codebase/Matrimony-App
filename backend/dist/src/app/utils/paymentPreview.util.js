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
exports.calculatePayableAmount = void 0;
const package_model_1 = __importDefault(require("../modules/package/package.model"));
const profile_model_1 = require("../modules/profile-details/profile.model");
const calculatePayableAmount = (profileId, packageId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Find Package
    const packageData = yield package_model_1.default.findById(packageId);
    if (!packageData) {
        throw new Error("Package not found");
    }
    // 2. Find Profile
    const profile = yield profile_model_1.Profile.findById(profileId);
    if (!profile) {
        throw new Error("Profile not found");
    }
    // 3. Default payable amount
    let payableAmount = packageData.price;
    let unusedAmount = 0;
    let remainingDays = 0;
    const currentSubscription = profile.subscription;
    // 4. Check current active subscription
    if ((currentSubscription === null || currentSubscription === void 0 ? void 0 : currentSubscription.isActive) &&
        currentSubscription.expiryDate &&
        currentSubscription.expiryDate > new Date()) {
        const expiryDate = currentSubscription.expiryDate;
        const currentPackage = yield package_model_1.default.findById(currentSubscription.packageId);
        if (currentPackage) {
            const now = new Date();
            const remainingMilliseconds = expiryDate.getTime() - now.getTime();
            remainingDays = Math.max(0, Math.ceil(remainingMilliseconds /
                (1000 * 60 * 60 * 24)));
            // 5. Calculate current package total days
            let totalDays = 0;
            switch (currentPackage.durationType) {
                case "DAY":
                    totalDays = currentPackage.duration;
                    break;
                case "MONTH":
                    totalDays = currentPackage.duration * 30;
                    break;
                case "YEAR":
                    totalDays = currentPackage.duration * 365;
                    break;
            }
            // 6. Calculate unused subscription amount
            if (totalDays > 0 && remainingDays > 0) {
                const dailyPrice = currentPackage.price / totalDays;
                unusedAmount =
                    dailyPrice * remainingDays;
                // 7. Calculate final payable amount
                payableAmount = Math.max(0, packageData.price - unusedAmount);
            }
        }
    }
    return {
        packageData,
        profile,
        packagePrice: packageData.price,
        unusedAmount,
        remainingDays,
        payableAmount: Number(payableAmount.toFixed(2)),
    };
});
exports.calculatePayableAmount = calculatePayableAmount;
