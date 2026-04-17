import type { Request } from 'express';
import type { Logger } from 'winston';
import type { IUser } from './entities/user';
import { IBoard, ITask } from './entities';

export interface IExtendedRequest extends Request {
  log?: Logger;
  user?: Pick<IUser, 'id'>;
  board?: IBoard;
  task?: ITask;
}