import crypto from "node:crypto";
import jwt from "jsonwebtoken";

import { Password } from "../modules/Password";
import { InvalidCredentialsError, ValidationError } from "../common/errors";

import type { IExtendedRequest, IRepository, IUser, UserDataReturn } from "../interfaces";

type ConstructorParams = {
  repository: IRepository;
};

export class AuthService {
  private readonly repository: IRepository;

  constructor({ repository }: ConstructorParams) {
    this.repository = repository;
  }

  private createSession(request: IExtendedRequest, userId: string): string {
    const token = jwt.sign(
      {
        user: { id: userId }
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    request.session = {
      jwt: token
    };

    return token;
  }

  public async signUp(request: IExtendedRequest, { name, email, password }: Pick<IUser, 'name' | 'email' | 'password'>): Promise<UserDataReturn> {

    const [existingUser] = await this.repository.findByQuery<IUser>({ email });

    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    const hashedPassword = await Password.hash(password);

    const newUser: IUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const createdUser = await this.repository.create<IUser, IUser>(newUser);

    const token = this.createSession(request, createdUser.id);

    const { password: _, ...userData } = createdUser;

    return {
      ...userData,
      token,
    };
  }

  public async signIn(request: IExtendedRequest, { email, password }: Pick<IUser, 'email' | 'password'>): Promise<UserDataReturn> {
    
    const [existingUser] = await this.repository.findByQuery<IUser>({ email })

    if (!existingUser) {
      throw new InvalidCredentialsError('Invalid email or password');
    }

    const isValidPassword = await Password.verify(existingUser.password, password);

    if (!isValidPassword) {
      throw new InvalidCredentialsError('Invalid email or password');
    }

    const token = this.createSession(request, existingUser.id);

    const { password: _ , ...userData } = existingUser;
    
    return {
      ...userData,
      token,
    };
  }

  public async signOut(request: IExtendedRequest): Promise<void> {
    request.session = null;
  }
}
