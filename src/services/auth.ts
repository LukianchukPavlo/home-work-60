import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import { Password } from "../modules/Password";
import { InvalidCredentialsError, ValidationError, NotFoundError } from "../common/errors";

import type { IExtendedRequest, IRepository, IUser, UserDataReturn, ConstructorParams } from "../interfaces";

export class AuthService {
  private readonly repository: IRepository<IUser>;

  constructor({ repository }: ConstructorParams) {
    this.repository = repository;
  }

  public async getMe(request: IExtendedRequest): Promise<UserDataReturn> {
    const userId = request.user?.id;

    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }


  public async signUp(request: IExtendedRequest, { name, email, password }: Pick<IUser, 'name' | 'email' | 'password'>): Promise<UserDataReturn> {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }

    const [existingUser] = await this.repository.findByQuery({ email });

    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    const hashedPassword = await Password.hash(password);

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
    };

    const createdUser = await this.repository.create(newUser);
    
    const token = jwt.sign(
      {
        user: { id: newUser.id }
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    request.session = {
      jwt: token
    };
    
    const { password: _, ...userData } = createdUser;

    return userData;
  }

  public async signIn(request: IExtendedRequest, { email, password }: Pick<IUser, 'email' | 'password'>): Promise<UserDataReturn> {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }

    const [existingUser] = await this.repository.findByQuery({ email }) || [];

    if (!existingUser) {
      throw new InvalidCredentialsError('Invalid email or password');
    }

    const isValidPassword = await Password.verify(existingUser.password, password);

    if (!isValidPassword) {
      throw new InvalidCredentialsError('Invalid email or password');
    }

    const token = jwt.sign(
      {
        user: { id: existingUser.id }
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    request.session = {
      jwt: token
    };

    const { password: _ , ...userData } = existingUser;
    
    return userData;
  }

  public async signOut(request: IExtendedRequest): Promise<void> {
    request.session = null;
  }
}
