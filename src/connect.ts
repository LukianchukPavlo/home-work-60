import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connect = async (uri: string, dbName: string) => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    console.log('URI:', uri);
    console.log('DB NAME:', dbName);

    client = new MongoClient(uri);

    await client.connect();

    db = client.db(dbName);

    console.log('✅ Connected to MongoDB');

    return { client, db };
  } catch (err) {
    console.error('❌ Mongo connection error:', err);
    throw err;
  }
};

export const getDb = () => {
  if (!db) {
    console.error('❌ DB NOT INITIALIZED');
    throw new Error('Database not initialized. Call connect() first.');
  }

  return db;
};

export const close = async () => {
  console.log('🛑 Closing DB connection');
  await client?.close();
};