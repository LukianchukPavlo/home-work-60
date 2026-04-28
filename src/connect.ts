import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connect = async (uri: string, dbName = 'app') => {
  client = new MongoClient(uri);

  await client.connect();

  db = client.db(dbName);

  console.log('✅ Connected to MongoDB');

  return { client, db };
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connect() first.');
  }

  return db;
};
