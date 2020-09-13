import { Router } from 'express';
import isAuthenticated from '../utils/isAuthenticated';
import { Role } from '@prisma/client';
import asyncHandler from 'utils/asyncHandler';
import { container } from 'tsyringe';
import ProfileController from 'controllers/profile.controller';
import roleMiddleware from 'utils/roleMiddleware';

const profileController = container.resolve(ProfileController);
const router = Router();
router
  .route('/')
  .post(isAuthenticated, asyncHandler(profileController.createProfile))
  .get(
    isAuthenticated,
    roleMiddleware(Role.USER),
    asyncHandler(profileController.getProfiles),
  );

router.delete(
  '/:profileId',
  isAuthenticated,
  asyncHandler(profileController.deleteProfile),
);

export default router;
