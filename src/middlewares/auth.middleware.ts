import { type Response, type NextFunction, type Request } from 'express';
import jwt from "jsonwebtoken";
import { UnauthorizedError } from '../common/errors';

import type { IUser } from '../interfaces';

export const authValidation = (req: Request, res: Response, next: NextFunction) => {
  const token = req.session?.jwt;

  console.log('🍪 SESSION:', req.session);

  if (!token) {
    return next(new UnauthorizedError('No authentication token provided'));
  }

  try {
    const payload = jwt.verify(
      token, 
      process.env.JWT_SECRET_KEY!
    ) as { user: Pick<IUser, 'id'> };

    console.log('✅ TOKEN OK, USER:', payload.user);
    
    req.user = payload.user;
  }
  catch {
    return next(new UnauthorizedError('Invalid authentication token'));
  }

  next();
};
