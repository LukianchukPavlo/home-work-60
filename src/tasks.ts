import { Router, type Response, type NextFunction } from 'express';
import { IExtendedRequest } from './interfaces/request';
import { validateBody } from './middlewares/validate.middleware';
import { taskAccessMiddleware } from './middlewares/task.middleware';

const router = Router();

const user = {
  id: '37d42238-a84d-47c4-8030-e3d0e91d43de'
};

const TASKS = [
  { id: '1', title: 'Task 1', description: 'First task', boardId: '1', authorId: user.id },
  { id: '2', title: 'Task 2', description: 'Second task', boardId: '1', authorId: user.id },
  { id: '3', title: 'Task 3', description: 'Third task', boardId: '2', authorId: user.id }
];

router.get('/', (req: IExtendedRequest, res: Response, next: NextFunction) => {
  const { boardId } = req.query;

  if (!boardId) {
    req.log?.warn('Missing boardId');

    return res.status(422).json({
      message: 'boardId is required'
    });
  }

  const result = TASKS.filter(
    task => task.boardId === boardId && task.authorId === user.id
  );

  req.log?.info('Get tasks by boardId');

  return res.json(result);
});

router.get(
  '/:taskId',
  taskAccessMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.task) {
      req.log?.warn('Task not found');

      return next({
        status: 404,
        message: 'Task not found'
      });
    }
    
    req.log?.info('Get task by id');
    return res.json(req.task);
  }
);

router.post(
  '/',
  validateBody({ title: 'string', boardId: 'string' }),
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const { title, description, boardId } = req.body;

    if (!title || !boardId) {
      req.log?.warn('Missing task fields');

      return res.status(400).json({
        message: 'Title and boardId are required'
      });
    }

    const newTask = {
      id: (TASKS.length + 1).toString(),
      title,
      description: description || '',
      boardId,
      authorId: user.id
    };

    TASKS.push(newTask);

    req.log?.info('Task created');

    return res.status(201).json(newTask);
  }
);

router.put(
  '/:taskId',
  taskAccessMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.task) {
      req.log?.warn('Task not found for update');

      return next({
        status: 404,
        message: 'Task not found'
      });
    }
    
    const { title, description } = req.body;

    if (title) req.task.title = title;
    if (description) req.task.description = description;

    req.log?.info('Task updated');

    return res.json(req.task);
  }
);

router.delete(
  '/:taskId',
  taskAccessMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const { taskId } = req.params;

    const index = TASKS.findIndex(task => task.id === taskId);
    if (index === -1) {
      req.log?.warn('Task not found for delete');

      return next({
        status: 404,
        message: 'Task not found'
      });
    }
    
    TASKS.splice(index, 1);

    req.log?.info('Task deleted');

    return res.json({ message: 'Task deleted' });
  }
);

export default router;