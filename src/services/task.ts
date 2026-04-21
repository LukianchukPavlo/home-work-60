import { validationResult } from "express-validator";
import { transformWorkflow } from "../utils";
import { ForbiddenError, NotFoundError, ValidationError } from "../common/errors";

import type { IBoard, IExtendedRequest, IRepository } from "../interfaces";
import type { WorkflowCode } from "../interfaces/workflow";
import type { ITask, TaskDataUpdate } from "../interfaces/entities/task";

type ConstructorParams = {
  boardRepository: IRepository;
  taskRepository: IRepository;
};

export class TaskService {
  private boardRepository: IRepository;
  private taskRepository: IRepository;

  constructor({ boardRepository, taskRepository }: ConstructorParams) {
    this.boardRepository = boardRepository;
    this.taskRepository = taskRepository;
  }

  public async getAllTasks(request: IExtendedRequest) {
    const { boardId = '' } = request.query!;

    const result = validationResult(request);

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }
    
    const board = await this.boardRepository.findById<IBoard>(boardId as string);

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to access this board');
    }

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    const tasks = await this.taskRepository.findByQuery<ITask>({
      authorId: request.user!.id,
      boardId: boardId as string
    });

    if (!tasks.length) {
      throw new NotFoundError('No tasks found');
    }

    return tasks.map(task => ({
      ...task,
      workflow: transformWorkflow(task.workflow as WorkflowCode),
    }));
  }

  public async getTaskById(id: string) {
    return this.taskRepository.findById<ITask>(id);
  }

  public async createTask(taskData: ITask) {
    return this.taskRepository.create<ITask, ITask>(taskData);
  }

  public async updateTask(id: string, taskData: TaskDataUpdate) {
    return this.taskRepository.update<TaskDataUpdate, ITask | null>(id, taskData);
  }

  public async deleteTask(id: string) {
    return this.taskRepository.delete(id);
  }
}
