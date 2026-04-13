import express from "express";
import path from "node:path";

import authRoutes from './auth';
import boardsRoutes from './boards';
import tasksRoutes from './tasks';

import { initLogger, getLogger } from './utils/logger';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(express.json());

const logDir = path.join(process.cwd(), 'logs');
initLogger(logDir);

const logger = getLogger();

app.use(loggerMiddleware(logger));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/boards', authMiddleware, boardsRoutes);
app.use('/api/v1/tasks', authMiddleware, tasksRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export { app };