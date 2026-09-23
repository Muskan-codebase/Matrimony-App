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
exports.deleteOnboardingItem = exports.updateOnboardingItem = exports.addOnboardingItem = exports.getOnboarding = void 0;
const onBoarding_model_1 = require("./onBoarding.model");
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("../../config/cloudinary");
const onBoarding_validation_1 = require("./onBoarding.validation");
function getOrCreateOnboarding() {
    return __awaiter(this, void 0, void 0, function* () {
        let onboarding = yield onBoarding_model_1.OnboardingArr.findOne();
        if (!onboarding) {
            const step1 = yield cloudinary_1.cloudinary.uploader.upload(path_1.default.join(process.cwd(), 'src', 'uploads', 'onboarding 1 1.png'), {
                folder: 'matrimony/onboarding',
            });
            const step2 = yield cloudinary_1.cloudinary.uploader.upload(path_1.default.join(process.cwd(), 'src', 'uploads', 'onboarding 2 1.png'), {
                folder: 'matrimony/onboarding',
            });
            const step3 = yield cloudinary_1.cloudinary.uploader.upload(path_1.default.join(process.cwd(), 'src', 'uploads', 'onboarding 3 1.png'), {
                folder: 'matrimony/onboarding',
            });
            onboarding = yield onBoarding_model_1.OnboardingArr.create({
                content: [
                    {
                        title: 'Step 1',
                        description: 'Default step 1 description',
                        image: step1.secure_url,
                        status: 'Active',
                    },
                    {
                        title: 'Step 2',
                        description: 'Default step 2 description',
                        image: step2.secure_url,
                        status: 'Active',
                    },
                    {
                        title: 'Step 3',
                        description: 'Default step 3 description',
                        image: step3.secure_url,
                        status: 'Active',
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
// POST - add a new onboarding item (used by the "Add" button in the admin panel)
const addOnboardingItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = onBoarding_validation_1.createOnboardingItemSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: parsed.error.issues[0].message,
                errors: parsed.error.flatten(),
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image is required',
            });
        }
        const image = req.file.path;
        const onboarding = yield getOrCreateOnboarding();
        onboarding.content.push({
            title: parsed.data.title,
            description: parsed.data.description,
            status: parsed.data.status,
            image,
        });
        yield onboarding.save();
        return res.status(201).json({
            success: true,
            message: 'Onboarding item added successfully',
            data: onboarding.content,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error adding onboarding item',
            error: error.message,
        });
    }
});
exports.addOnboardingItem = addOnboardingItem;
const updateOnboardingItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const validatedData = onBoarding_validation_1.onboardingSchema.partial().parse(req.body);
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
            'content._id': itemId,
        }, {
            $set: updateFields,
        }, {
            new: true,
        });
        if (!onboarding) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding item not found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Onboarding item updated successfully',
            data: onboarding.content,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating onboarding item',
            error: error.message,
        });
    }
});
exports.updateOnboardingItem = updateOnboardingItem;
// DELETE - remove an onboarding item (used by the "Delete" button in the admin panel)
const deleteOnboardingItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedParams = onBoarding_validation_1.onboardingItemIdSchema.safeParse(req.params);
        if (!parsedParams.success) {
            return res.status(400).json({
                success: false,
                message: 'Invalid item ID',
            });
        }
        const onboarding = yield onBoarding_model_1.OnboardingArr.findOneAndUpdate({}, { $pull: { content: { _id: parsedParams.data.itemId } } }, { new: true });
        if (!onboarding) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding not found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Onboarding item deleted successfully',
            data: onboarding.content,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting onboarding item',
            error: error.message,
        });
    }
});
exports.deleteOnboardingItem = deleteOnboardingItem;
