import { Response, NextFunction } from 'express';
import { IExtendedRequest } from '../interfaces/request';

export function errorMiddleware(err: any, req: IExtendedRequest, res: Response, next: NextFunction) {
  req.log?.error({
    message: err.message,
    stack: err.stack
  });

  res.status(500).json({
    message: 'Internal server error'
  });
}