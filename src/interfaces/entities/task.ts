export type TaskWorkflow = 'todo' | 'in-progress' | 'done';

export interface ITask {
  id: string;
  title: string;
  description: string;
  workflow: TaskWorkflow;
  boardId: string;
  authorId: string;
}

export type TaskDataUpdate = Partial<Omit<ITask, 'id' | 'authorId'>>;
