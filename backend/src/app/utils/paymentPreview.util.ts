import Package from "../modules/package/package.model";
import { Profile } from "../modules/profile-details/profile.model";
import { Types } from "mongoose";

export const calculatePayableAmount = async (
    profileId: Types.ObjectId,
    packageId: Types.ObjectId
) => {
    // 1. Find Package
    const packageData = await Package.findById(packageId);

    if (!packageData) {
        throw new Error("Package not found");
    }

    // 2. Find Profile
    const profile = await Profile.findById(profileId);

    if (!profile) {
        throw new Error("Profile not found");
    }

    // 3. Default payable amount
    let payableAmount = packageData.price;

    let unusedAmount = 0;
    let remainingDays = 0;

    const currentSubscription = profile.subscription;

    // 4. Check current active subscription
    if (
        currentSubscription?.isActive &&
        currentSubscription.expiryDate &&
        currentSubscription.expiryDate > new Date()
    ) {
        const expiryDate = currentSubscription.expiryDate;

        const currentPackage = await Package.findById(
            currentSubscription.packageId
        );

        if (currentPackage) {
            const now = new Date();

            const remainingMilliseconds =
                expiryDate.getTime() - now.getTime();

            remainingDays = Math.max(
                0,
                Math.ceil(
                    remainingMilliseconds /
                    (1000 * 60 * 60 * 24)
                )
            );

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
                const dailyPrice =
                    currentPackage.price / totalDays;

                unusedAmount =
                    dailyPrice * remainingDays;

                // 7. Calculate final payable amount
                payableAmount = Math.max(
                    0,
                    packageData.price - unusedAmount
                );
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
};