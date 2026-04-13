import crypto from 'node:crypto';
import type { Response, NextFunction } from 'express';
import type { IExtendedRequest } from '../interfaces/request';
import type { Logger } from 'winston';

export const loggerMiddleware = (instance: Logger) => {
  return (req: IExtendedRequest, res: Response, next: NextFunction) => {
    req.log = instance.child({
      requestId: crypto.randomUUID(),
      method: req.method,
      url: req.url
    });

    next();
  };
};