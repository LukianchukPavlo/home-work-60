import { Response, NextFunction } from 'express';
import { IExtendedRequest } from '../interfaces/request';

type Schema = Record<string, 'string' | 'number' | 'boolean'>;

export function validateBody(schema: Schema) {
  return (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const body = req.body;

    for (const key in schema) {
      const expectedType = schema[key];
      const value = body[key];

      if (value === undefined || value === null) {
        req.log?.warn(`Missing field: ${key}`);

        return res.status(400).json({
          message: `${key} is required`
        });
      }

      if (typeof value !== expectedType) {
        req.log?.warn(`Invalid type for field: ${key}`);

        return res.status(400).json({
          message: `${key} must be ${expectedType}`
        });
      }
    }

    next();
  };
}