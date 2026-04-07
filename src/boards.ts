import {Router, type Request, type Response, type NextFunction } from 'express';

const user = {
  id: '37d42238-a84d-47c4-8030-e3d0e91d43de',
  email: 'alex@gmail.com'
};

const BOARDS = [
  { id: '1', name: 'Board 1', description: 'First board', authorId: user.id },
  { id: '2', name: 'Board 2', description: 'Second board', authorId: user.id },
  { id: '3', name: 'Board 3', description: 'Third board', authorId: user.id }
];

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(BOARDS);
});

router.get('/:boardId', (req: Request, res: Response, next: NextFunction) => {
  const { boardId } = req.params;
  const board = BOARDS.find(board => board.id === boardId);

  if (!board) {
    return res.status(404).json({ message: 'Board not found' });
  }

  return res.status(200).json(board);
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required' });

  const newBoard = {
    id: (BOARDS.length + 1).toString(),
    name,
    description: description || '',
    authorId: user.id
  };

  BOARDS.push(newBoard);
  return res.status(201).json(newBoard);
});

router.delete('/:boardId', (req: Request, res: Response, next: NextFunction) => {
  const { boardId } = req.params;
  const index = BOARDS.findIndex(board => board.id === boardId);

  if (index === -1) return res.status(404).json({ message: 'Board not found' });

  BOARDS.splice(index, 1);
  return res.status(200).json({ message: 'Board deleted' });
});

router.put('/:boardId', (req: Request, res: Response, next: NextFunction) => {
  const { boardId } = req.params;
  const { name, description } = req.body;

  const board = BOARDS.find(board => board.id === boardId);
  if (!board) return res.status(404).json({ message: 'Board not found' });

  if (name) board.name = name;
  if (description) board.description = description;

  return res.status(200).json(board);
});

export default router