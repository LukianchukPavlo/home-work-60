import { validationResult } from 'express-validator';
import { NextFunction, Response } from 'express';
import { ValidationError } from '../common/errors';
import { IExtendedRequest } from '../interfaces';

export const validateRequest = (req: IExtendedRequest, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ValidationError('Validation failed', errors.array()));
  }

  next();
};