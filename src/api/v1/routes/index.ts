import  { Router } from 'express';

import { authValidation } from '../../../middlewares/auth.middleware';
import { createAuthRouter } from './auth';
// import { router as boards } from './board';

const router = Router();

router.use('/auth', createAuthRouter());
// router.use('/boards', authValidation, boards);

export { router };
