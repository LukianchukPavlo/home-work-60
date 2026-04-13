import { Response, NextFunction } from 'express';
import { IExtendedRequest } from '../interfaces/request';

const TASKS = [
  { id: '1', title: 'Task 1', boardId: '1', authorId: '37d42238-a84d-47c4-8030-e3d0e91d43de' },
  { id: '2', title: 'Task 2', boardId: '1', authorId: '37d42238-a84d-47c4-8030-e3d0e91d43de' },
  { id: '3', title: 'Task 3', boardId: '2', authorId: '37d42238-a84d-47c4-8030-e3d0e91d43de' },
];

export function taskAccessMiddleware(
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
) {
  const { taskId } = req.params;

  const task = TASKS.find(t => t.id === taskId);

  if (!task) {
    req.log?.warn({
      message: 'Task not found',
      taskId
    });
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.authorId !== req.user?.id) {
    req.log?.warn({
      message: 'Forbidden task access',
      taskId,
      userId: req.user?.id
    });
    return res.status(403).json({ message: 'Forbidden' });
  }

  req.task = task;

  next();
}