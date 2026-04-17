import { AuthService } from "../../../services";

import { StatusCodes, type IExtendedRequest } from '../../../interfaces';
import type { NextFunction, Response } from 'express';

type ConstructorParams = {
  authService: AuthService;
};

export class AuthController {
  private authService: AuthService;

  constructor({ authService }: ConstructorParams) {
    this.authService = authService;
  }

  async signUp(req: IExtendedRequest, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    this.authService
      .signUp(req, { name, email, password })
      .then(user => {
        return res
          .status(StatusCodes.CREATED)
          .json({
            data: user,
            error: {}
          });
      })
      .catch(error => {
        req?.log?.error(`Failed to create user`, { error });

        next(error);
      });
  }

  async signIn(req: IExtendedRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    this.authService
      .signIn(req, { email, password })
      .then(user => {
        res.status(StatusCodes.SUCCESS).json({
          data: user,
          error: {}
        });
      })
      .catch(error => {
        req?.log?.error(`Failed to sign in user with email ${email}`, { error });

        next(error);
      });
  }

  async signOut(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      req.session = null;

      req.log?.info('User signed out');

      return res.status(StatusCodes.SUCCESS).json({
        data: { message: 'Sign out successful' },
        error: {}
      });
    } catch (error) {
      req?.log?.error('Failed to sign out', { error });
      next(error);
    }
  }
}
