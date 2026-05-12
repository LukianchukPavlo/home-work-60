import crypto from 'node:crypto';
import type { Response, NextFunction, Request } from 'express';
import type { Logger } from 'winston';

export const loggerMiddleware = (instance: Logger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.log = instance.child({
      requestId: crypto.randomUUID(),
      method: req.method,
      url: req.url
    });

    next();
  };
};