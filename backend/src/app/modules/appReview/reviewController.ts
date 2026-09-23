import { Request, Response } from 'express';
import { AppReview } from './reviewModel';
import { Profile } from '../profile-details/profile.model';
import { createAppReviewSchema, appReviewIdSchema } from './reviewValidation';

export const createAppReview = async (req: Request, res: Response) => {
  try {
    const authId = req.user.id;

    const parsed = createAppReviewSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0].message,
        errors: parsed.error.flatten(),
      });
    }

    const profile = await Profile.findOne({ userId: authId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Your profile was not found.',
      });
    }

    const review = await AppReview.create({
      profileId: profile._id,
      ...parsed.data,
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    console.error('Create App Review Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while submitting the review',
    });
  }
};

export const getAppReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await AppReview.find()
      .populate(
        'profileId',
        'basicDetails.firstName basicDetails.lastName matrimonyId profilePhoto',
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'App reviews fetched successfully',
      data: reviews,
    });
  } catch (error) {
    console.error('Get App Reviews Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching reviews',
    });
  }
};

export const deleteAppReview = async (req: Request, res: Response) => {
  try {
    const parsedParams = appReviewIdSchema.safeParse(req.params);

    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID',
      });
    }

    const deleted = await AppReview.findByIdAndDelete(parsedParams.data.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete App Review Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting the review',
    });
  }
};
