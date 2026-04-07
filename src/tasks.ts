import { Router, type Request, type Response, type NextFunction } from 'express';

const router = Router();

const user = {
  id: '37d42238-a84d-47c4-8030-e3d0e91d43de',
  email: 'alex@gmail.com'
};

const TASKS = [
  { id: '1', title: 'Task 1', description: 'First task', boardId: '1', authorId: user.id },
  { id: '2', title: 'Task 2', description: 'Second task', boardId: '1', authorId: user.id },
  { id: '3', title: 'Task 3', description: 'Third task', boardId: '2', authorId: user.id },
];

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { boardId } = req.query;

  if (!boardId) {
    return res.status(422).json({ message: "You need to specify board ID" });
  }

  const filteredTasks = TASKS.filter(
    task => task.boardId === boardId && task.authorId === user.id
  );

  return res.status(200).json(filteredTasks);
});

router.get('/:taskId', (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  const task = TASKS.find(task => task.id === taskId);

  if (!task) return res.status(404).json({ message: 'Task not found' });

  return res.status(200).json(task);
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { title, description, boardId } = req.body;

  if (!title || !boardId) {
    return res.status(400).json({ message: 'Title and boardId are required' });
  }

  const newTask = {
    id: (TASKS.length + 1).toString(),
    title,
    description: description || '',
    boardId,
    authorId: user.id
  };

  TASKS.push(newTask);
  return res.status(201).json(newTask);
});

router.put('/:taskId', (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  const { title, description } = req.body;

  const task = TASKS.find(task => task.id === taskId);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (title) task.title = title;
  if (description) task.description = description;

  return res.status(200).json(task);
});


router.delete('/:taskId', (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  const index = TASKS.findIndex(task => task.id === taskId);

  if (index === -1) return res.status(404).json({ message: 'Task not found' });

  TASKS.splice(index, 1);
  return res.status(200).json({ message: 'Task deleted' });
});

export default router;