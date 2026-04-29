import data from '../../public/db.json';
import { getDb } from '../connect';

export async function seed() {
  const db = getDb();

  await db.collection('users').deleteMany({});
  await db.collection('boards').deleteMany({});
  await db.collection('tasks').deleteMany({});

  await db.collection('users').insertMany(data.users);
  await db.collection('boards').insertMany(data.boards);
  await db.collection('tasks').insertMany(data.tasks);

  console.log('🌱 Seed done');
  
}
