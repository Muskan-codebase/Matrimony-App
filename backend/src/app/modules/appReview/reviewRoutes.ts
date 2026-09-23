import { Router } from 'express';
import { authenticate } from '../../middlewares/authMiddleware';
import {
  createAppReview,
  getAppReviews,
  deleteAppReview,
} from './reviewController';

const router = Router();

router.post('/', authenticate, createAppReview);
router.get('/', authenticate, getAppReviews);
router.delete('/:id', authenticate, deleteAppReview);

export const appReviewRouter = router;
