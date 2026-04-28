import { MongoClient } from 'mongodb';

process.env.MONGODB_URI = 'mongodb://localhost:27017';

export let CLIENT: MongoClient | null = null;

export const connect = async () => {
  const uri = process.env.MONGODB_URI || '';
  const client = new MongoClient(uri);

  try {
    CLIENT = await client.connect();
    console.log('Connected to MongoDB')

    return CLIENT;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
