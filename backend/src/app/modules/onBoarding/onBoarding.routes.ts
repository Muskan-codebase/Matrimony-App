import { Router } from 'express';
import {
  getOnboarding,
  addOnboardingItem,
  updateOnboardingItem,
  deleteOnboardingItem,
} from './onBoarding.controller';
import { upload } from '../../config/cloudinary';

const router = Router();

router.get('/', getOnboarding);
router.post('/', upload.single('image'), addOnboardingItem);
router.patch('/:itemId', upload.single('image'), updateOnboardingItem);
router.delete('/:itemId', deleteOnboardingItem);

export const onboardingRoutes = router;
