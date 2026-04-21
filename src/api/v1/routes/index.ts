import  { Router } from 'express';

import { authValidation } from '../../../middlewares/auth.middleware';
import { createAuthRouter } from './auth';
import { createBoardRouter } from './boards'


const router = Router();

router.use('/auth', createAuthRouter());
router.use('/boards', authValidation, createBoardRouter());

export { router };
