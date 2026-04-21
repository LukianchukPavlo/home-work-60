import type { Response, NextFunction } from 'express';
import type { TaskService } from '../../../services';
import { StatusCodes, type IExtendedRequest } from '../../../interfaces';

type ConstructorParams = {
  taskService: TaskService;
};

export class TaskController {
  private taskService: TaskService;

  constructor({ taskService }: ConstructorParams) {
    this.taskService = taskService;
  }

  public async getAllTasks(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const tasks = await this.taskService.getAllTasks(req);

      res.status(StatusCodes.SUCCESS).json({ data: tasks });
    } catch (error) {
      req?.log?.error(`Failed to fetch tasks`, { error });

      next(error);
    }
  }
}
