import { Router, type Response, type NextFunction } from 'express';
import { IExtendedRequest } from '../../../interfaces/request';
import { validateBody } from '../../../middlewares/validate.middleware';

const router = Router();

const user = {
  id: '37d42238-a84d-47c4-8030-e3d0e91d43de',
  email: 'alex@gmail.com',
  password: 'alex-12345'
};

router.get('/', (req: IExtendedRequest, res: Response, next: NextFunction) => {
  req.log?.info('Hello route hit');
  res.send('Hello world!');
});

router.post(
  '/sign-up',
  validateBody({ email: 'string', password: 'string' }),
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      req.log?.warn('Missing email or password');

      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    req.log?.info('User signed up');

    return res.status(201).json({
      message: 'You signed up successfully',
      user: {
        id: user.id,
        email
      }
    });
  }
);

router.post(
  '/sign-in',
  validateBody({ email: 'string', password: 'string' }),
  (req: IExtendedRequest, res: Response) => {
    const email = String(req.body.email).trim();
    const password = String(req.body.password).trim();

    if (email !== user.email || password !== user.password) {
      req.log?.warn('Invalid credentials');

      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    req.log?.info('User signed in');

    return res.status(200).json({
      user: {
        id: user.id,
        email
      },
      token: 'fake-jwt-token'
    });
  }
);

router.post(
  '/sign-out',
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    req.log?.info('User signed out');

    return res.status(200).json({
      message: 'You signed out successfully'
    });
  }
);

router.get(
  '/me',
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    req.log?.info('Get current user');

    return res.status(200).json({
      id: user.id,
      email: user.email
    });
  }
);

export default router;