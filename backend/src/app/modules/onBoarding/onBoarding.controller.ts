import { Request, Response } from 'express';
import { z } from 'zod';
import { OnboardingArr } from './onBoarding.model';
import path from "path";
import { cloudinary } from "../../config/cloudinary";
import { onboardingArrSchema, onboardingSchema } from './onBoarding.validation';

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
async function getOrCreateOnboarding() {
  
  let onboarding = await OnboardingArr.findOne();

  if (!onboarding) {

    const step1 = await cloudinary.uploader.upload(
      path.join(process.cwd(), "src", "uploads", "onboarding 1 1.png"),
      {
        folder: "matrimony/onboarding",
      }
    );

    const step2 = await cloudinary.uploader.upload(
      path.join(process.cwd(), "src", "uploads", "onboarding 2 1.png"),
      {
        folder: "matrimony/onboarding",
      }
    );

    const step3 = await cloudinary.uploader.upload(
      path.join(process.cwd(), "src", "uploads", "onboarding 3 1.png"),
      {
        folder: "matrimony/onboarding",
      }
    );

    onboarding = await OnboardingArr.create({
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

export const updateOnboardingItem = async (
  req: Request,
  res: Response
) => {

  try {

    const { itemId } = req.params;

    const validatedData = onboardingSchema
      .partial()
      .parse(req.body);

    // If image uploaded, save Cloudinary URL
    if (req.file) {
      validatedData.image = (req.file as any).path;
    }

    await getOrCreateOnboarding();

    const updateFields = Object.fromEntries(
      Object.entries(validatedData).map(([key, value]) => [
        `content.$.${key}`,
        value,
      ])
    );

    const onboarding = await OnboardingArr.findOneAndUpdate(
      {
        "content._id": itemId,
      },
      {
        $set: updateFields,
      },
      {
        new: true,
      }
    );

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

  } catch (error: any) {

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

};
