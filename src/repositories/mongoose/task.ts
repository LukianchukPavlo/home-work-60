import { MongooseRepository } from './base';
import { Task } from '../../models';
import { ITask } from '../../interfaces';

export class TaskRepository extends MongooseRepository<ITask> {
  constructor() {
    super(Task);
  }

  public async updateTaskWorkflow(
    id: string,
    data: Pick<ITask, 'workflow'>
  ): Promise<ITask> {
    const task = await this.model
      .findOneAndUpdate({ id }, data, { returnDocument: 'after' })
      .lean();

    return task as ITask;
  }

  public getTasksCursor(query: Partial<ITask>): AsyncIterable<ITask> {
    return this.model.find(query).lean().cursor();
  }

  public async getTasksStatistics(authorId: string) {
    const result = await this.model.aggregate([
      {
        $match: {
          authorId,
        },
      },
      {
        $group: {
          _id: '$workflow',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      totalTasks: 0,
      todoTasks: 0,
      progressTasks: 0,
      doneTasks: 0,
    };

    result.forEach((item) => {
      stats.totalTasks += item.count;

      if (item._id === 'todo') {
        stats.todoTasks = item.count;
      }

      if (item._id === 'progress') {
        stats.progressTasks = item.count;
      }

      if (item._id === 'done') {
        stats.doneTasks = item.count;
      }
    });

    return stats;
  }
}