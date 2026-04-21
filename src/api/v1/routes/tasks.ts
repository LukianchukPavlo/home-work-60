import { Router } from 'express';
import { query } from 'express-validator';

import { BoardRepository, TaskRepository } from '../../../repositories/json-db';
import { TaskService } from '../../../services';
import { TaskController } from '../controllers/task';

export const createTaskRouter = (): Router => {
  const router = Router();

  const boardRepository = new BoardRepository();
  const taskRepository = new TaskRepository();
  const service = new TaskService({ boardRepository, taskRepository });
  const controller = new TaskController({ taskService: service });

  router.get(
    '/',
    [
      query('boardId')
        .notEmpty()
        .trim()
        .withMessage('boardId query parameter is required')
    ],
    controller.getAllTasks.bind(controller));

  return router;
};

