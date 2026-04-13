import { Router, type Response, type NextFunction } from 'express';
import { IExtendedRequest } from './interfaces/request';
import { validateBody } from './middlewares/validate.middleware';
import { boardAccessMiddleware } from './middlewares/board.middleware';

const router = Router();

const user = {
  id: '37d42238-a84d-47c4-8030-e3d0e91d43de'
};

const BOARDS = [
  { id: '1', name: 'Board 1', description: 'First board', authorId: user.id },
  { id: '2', name: 'Board 2', description: 'Second board', authorId: user.id },
  { id: '3', name: 'Board 3', description: 'Third board', authorId: user.id }
];

router.get('/', (req: IExtendedRequest, res: Response, next: NextFunction) => {
  req.log?.info('Get all boards');
  return res.json(BOARDS);
});

router.get(
  '/:boardId',
  boardAccessMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    req.log?.info('Get board by id');
    return res.json(req.board);
  }
);

router.post(
  '/',
  validateBody({ name: 'string' }),
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if (!name) {
      req.log?.warn('Missing board name');

      return res.status(400).json({
        message: 'Name is required'
      });
    }

    const newBoard = {
      id: (BOARDS.length + 1).toString(),
      name,
      description: description || '',
      authorId: user.id
    };

    BOARDS.push(newBoard);

    req.log?.info('Board created');

    return res.status(201).json(newBoard);
  }
);

router.put(
  '/:boardId',
  boardAccessMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if (name) req.board.name = name;
    if (description) req.board.description = description;

    req.log?.info('Board updated');

    return res.json(req.board);
  }
);

router.delete(
  '/:boardId',
  boardAccessMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const { boardId } = req.params;

    const index = BOARDS.findIndex(b => b.id === boardId);
    BOARDS.splice(index, 1);

    req.log?.info('Board deleted');

    return res.json({ message: 'Board deleted' });
  }
);

export default router;