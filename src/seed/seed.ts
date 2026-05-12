import data from '../../public/db.json';
import { User } from '../models/user'; 
import { Board } from '../models/board';
import { Task } from '../models/task';

export async function seed() {
  try {
    
    await User.deleteMany({});
    await Board.deleteMany({});
    await Task.deleteMany({});

    
    await User.insertMany(data.users);
    await Board.insertMany(data.boards);
    await Task.insertMany(data.tasks);

    console.log('🌱 Seed done');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  }
}
