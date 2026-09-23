import { Request, Response } from 'express';
import { OnboardingArr } from './onBoarding.model';
import path from 'path';
import { cloudinary } from '../../config/cloudinary';
import {
  onboardingSchema,
  createOnboardingItemSchema,
  onboardingItemIdSchema,
} from './onBoarding.validation';

async function getOrCreateOnboarding() {
  let onboarding = await OnboardingArr.findOne();

  if (!onboarding) {
    const step1 = await cloudinary.uploader.upload(
      path.join(process.cwd(), 'src', 'uploads', 'onboarding 1 1.png'),
      {
        folder: 'matrimony/onboarding',
      },
    );

    const step2 = await cloudinary.uploader.upload(
      path.join(process.cwd(), 'src', 'uploads', 'onboarding 2 1.png'),
      {
        folder: 'matrimony/onboarding',
      },
    );

    const step3 = await cloudinary.uploader.upload(
      path.join(process.cwd(), 'src', 'uploads', 'onboarding 3 1.png'),
      {
        folder: 'matrimony/onboarding',
      },
    );

    onboarding = await OnboardingArr.create({
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
}

// GET - fetch onboarding content (auto-creates default if not present)
export const getOnboarding = async (req: Request, res: Response) => {
  try {
    const onboarding = await getOrCreateOnboarding();

    res.status(200).json({
      success: true,
      data: onboarding.content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching onboarding content',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// POST - add a new onboarding item (used by the "Add" button in the admin panel)
export const addOnboardingItem = async (req: Request, res: Response) => {
  try {
    const parsed = createOnboardingItemSchema.safeParse(req.body);

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

    const image = (req.file as any).path;

    const onboarding = await getOrCreateOnboarding();

    onboarding.content.push({
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      image,
    } as any);

    await onboarding.save();

    return res.status(201).json({
      success: true,
      message: 'Onboarding item added successfully',
      data: onboarding.content,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error adding onboarding item',
      error: error.message,
    });
  }
};

export const updateOnboardingItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const validatedData = onboardingSchema.partial().parse(req.body);

    // If image uploaded, save Cloudinary URL
    if (req.file) {
      validatedData.image = (req.file as any).path;
    }

    await getOrCreateOnboarding();

    const updateFields = Object.fromEntries(
      Object.entries(validatedData).map(([key, value]) => [
        `content.$.${key}`,
        value,
      ]),
    );

    const onboarding = await OnboardingArr.findOneAndUpdate(
      {
        'content._id': itemId,
      },
      {
        $set: updateFields,
      },
      {
        new: true,
      },
    );

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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error updating onboarding item',
      error: error.message,
    });
  }
};

// DELETE - remove an onboarding item (used by the "Delete" button in the admin panel)
export const deleteOnboardingItem = async (req: Request, res: Response) => {
  try {
    const parsedParams = onboardingItemIdSchema.safeParse(req.params);

    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID',
      });
    }

    const onboarding = await OnboardingArr.findOneAndUpdate(
      {},
      { $pull: { content: { _id: parsedParams.data.itemId } } },
      { new: true },
    );

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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting onboarding item',
      error: error.message,
    });
  }
};
