import { Response, NextFunction } from 'express';
import { IExtendedRequest } from '../interfaces/request';

const BOARDS = [
  { id: '1', name: 'Board 1', authorId: '37d42238-a84d-47c4-8030-e3d0e91d43de' },
];

export function boardAccessMiddleware(req: IExtendedRequest, res: Response, next: NextFunction) {
  const { boardId } = req.params;

  const board = BOARDS.find(b => b.id === boardId);

  if (!board) {
    req.log?.warn('Board not found');
    return res.status(404).json({ message: 'Board not found' });
  }

  if (board.authorId !== req.user?.id) {
    req.log?.warn('Forbidden board access');
    return res.status(403).json({ message: 'Forbidden' });
  }

  req.board = board;

  next();
}