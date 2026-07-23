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
exports.updateOnboardingItem = exports.getOnboarding = void 0;
const onBoarding_model_1 = require("./onBoarding.model");
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("../../config/cloudinary");
const onBoarding_validation_1 = require("./onBoarding.validation");
// const DEFAULT_ONBOARDING_CONTENT = [
//   {
//     title: 'Step 1',
//     description: 'Default step 1 description',
//     image: "/uploads/onboarding 1 1.png",
//     status: 'Active' as const,
//   },
//   {
//     title: 'Step 2',
//     description: 'Default step 2 description',
//     image: "/uploads/onboarding 2 1.png",
//     status: 'Active' as const,
//   },
//   {
//     title: 'Step 3',
//     description: 'Default step 3 description',
//     image: "/uploads/onboarding 3 1.png",
//     status: 'Active' as const,
//   },
// ];
// Shared helper - ensures an onboarding document always exists
// async function getOrCreateOnboarding() {
//   let onboarding = await OnboardingArr.findOne();
//   if (!onboarding) {
//     onboarding = await OnboardingArr.create({
//       content: DEFAULT_ONBOARDING_CONTENT,
//     });
//   }
//   return onboarding;
// }
function getOrCreateOnboarding() {
    return __awaiter(this, void 0, void 0, function* () {
        let onboarding = yield onBoarding_model_1.OnboardingArr.findOne();
        if (!onboarding) {
            const step1 = yield cloudinary_1.cloudinary.uploader.upload(path_1.default.join(process.cwd(), "src", "uploads", "onboarding 1 1.png"), {
                folder: "matrimony/onboarding",
            });
            const step2 = yield cloudinary_1.cloudinary.uploader.upload(path_1.default.join(process.cwd(), "src", "uploads", "onboarding 2 1.png"), {
                folder: "matrimony/onboarding",
            });
            const step3 = yield cloudinary_1.cloudinary.uploader.upload(path_1.default.join(process.cwd(), "src", "uploads", "onboarding 3 1.png"), {
                folder: "matrimony/onboarding",
            });
            onboarding = yield onBoarding_model_1.OnboardingArr.create({
                content: [
                    {
                        title: "Step 1",
                        description: "Default step 1 description",
                        image: step1.secure_url,
                        status: "Active",
                    },
                    {
                        title: "Step 2",
                        description: "Default step 2 description",
                        image: step2.secure_url,
                        status: "Active",
                    },
                    {
                        title: "Step 3",
                        description: "Default step 3 description",
                        image: step3.secure_url,
                        status: "Active",
                    },
                ],
            });
        }
        return onboarding;
    });
}
// GET - fetch onboarding content (auto-creates default if not present)
const getOnboarding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const onboarding = yield getOrCreateOnboarding();
        res.status(200).json({
            success: true,
            data: onboarding.content,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching onboarding content',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.getOnboarding = getOnboarding;
const updateOnboardingItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const validatedData = onBoarding_validation_1.onboardingSchema
            .partial()
            .parse(req.body);
        // If image uploaded, save Cloudinary URL
        if (req.file) {
            validatedData.image = req.file.path;
        }
        yield getOrCreateOnboarding();
        const updateFields = Object.fromEntries(Object.entries(validatedData).map(([key, value]) => [
            `content.$.${key}`,
            value,
        ]));
        const onboarding = yield onBoarding_model_1.OnboardingArr.findOneAndUpdate({
            "content._id": itemId,
        }, {
            $set: updateFields,
        }, {
            new: true,
        });
        if (!onboarding) {
            return res.status(404).json({
                success: false,
                message: "Onboarding item not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Onboarding item updated successfully",
            data: onboarding.content,
        });
    }
    catch (error) {
        // if (error instanceof z.ZodError) {
        //   return res.status(400).json({
        //     success: false,
        //     message: "Validation error",
        //     errors: error.errors,
        //   });
        // }
        return res.status(500).json({
            success: false,
            message: "Error updating onboarding item",
            error: error.message,
        });
    }
});
exports.updateOnboardingItem = updateOnboardingItem;
