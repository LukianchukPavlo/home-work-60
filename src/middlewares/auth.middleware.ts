import { Response, NextFunction } from 'express';
import { IExtendedRequest } from '../interfaces/request';

export function authMiddleware(req: IExtendedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    req.log?.warn('Unauthorized request');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = {
    id: '37d42238-a84d-47c4-8030-e3d0e91d43de'
  };

  next();
}