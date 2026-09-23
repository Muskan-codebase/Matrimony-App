import { Types } from "mongoose";
import { calculatePayableAmount } from "../utils/paymentPreview.util";

export const previewPayment = async (
    profileId: Types.ObjectId,
    packageId: Types.ObjectId
) => {
    const {
        packageData,
        packagePrice,
        unusedAmount,
        remainingDays,
        payableAmount,
    } = await calculatePayableAmount(
        profileId,
        packageId
    );

    return {
        packageId: packageData._id,
        packageName: packageData.title,

        packagePrice,

        unusedAmount: Number(
            unusedAmount.toFixed(2)
        ),

        remainingDays,

        payableAmount,

        currency: "INR",
    };
};