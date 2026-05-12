import { validationResult } from 'express-validator';
import { NextFunction, Response, Request } from 'express';
import { ValidationError } from '../common/errors';


export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ValidationError('Validation failed', errors.array()));
  }

  next();
};