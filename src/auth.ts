import { Router, type Request, type Response, type NextFunction } from 'express';

const router = Router();

const user = {
  id: '37d42238-a84d-47c4-8030-e3d0e91d43de',
  email: 'alex@gmail.com'
};

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello world!');
});

router.post(
  '/sign-up',
  (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

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
  (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    
    if (email !== user.email) {
      return res.status(401).json({
        message: 'Invalid credentials'
      }); 
    }

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
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      message: 'You signed out successfully'
    });
  }
);

router.get(
  '/me',
  (req: Request, res: Response, next: NextFunction) => {
    
    return res.status(200).json({
      id: user.id,
      email: user.email
    });
  }
);

export default router;