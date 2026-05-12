import mongoose, { Model, QueryFilter } from 'mongoose';
import type { IRepository } from '../../interfaces/repository';

type DBOptions = {
  uri: string;
  user: string;
  password: string;
  name: string;
};
export abstract class MongooseRepository<M extends { id: string }> implements IRepository<M> {
  protected readonly model: Model<M>;

  constructor(model: Model<M>) {
    this.model = model;
  }

  public async findAll(): Promise<M[]> {
    const documents = await this.model
      .find()
      .lean<M[]>();

    return documents;
  }

  public async findById(id: string): Promise<M | null> {
    const document = await this.model
      .findOne({ id }) // UUID
      .lean<M>();

    return document;
  }

  public async findByQuery(query: QueryFilter<M>): Promise<M[]> {
    const documents = await this.model
      .find(query)
      .lean<M[]>();

    return documents;
  }

  public async create(data: Partial<M>): Promise<M> {
    const document = await this.model
      .create(data);

    return document.toObject() as M;
  }

  public async createMany(data: Partial<M>[]): Promise<M[]> {
    const documents = await this.model
      .create(data);

    return documents.map((doc) => doc.toObject()) as M[];
  }

  public async update(id: string, data: Partial<M>): Promise<M> {
    const document = await this.model
      .findOneAndUpdate({ id }, data, { returnDocument: 'after' })
      .lean();

    return document as M;
  }
  
  public async delete(id: string): Promise<void> {
    await this.model
      .deleteOne({ id });
  }

  public async deleteByQuery(query: Partial<M>): Promise<void> {
    await this.model
      .deleteMany(query);
  }
}

export const connect = async (options: DBOptions) => {
  const uri = options.uri
    .replace('{{user}}', encodeURIComponent(options.user))
    .replace('{{password}}', encodeURIComponent(options.password));

  return mongoose.connect(uri, {
    dbName: options.name,
  });
};

export const getClient = () => {
  return mongoose.connection.getClient();
};

export const getDB = () => {
  return mongoose.connection.db;
};

export const cleanDB = async () => {
  if (!mongoose.connection) {
    throw new Error('Client not initialized. Please call connect() first.');
  }

  if (!mongoose.connection.db) {
    throw new Error('Client not initialized. Please call connect() first.');
  }

  const collections = await mongoose.connection.db
    .listCollections()
    .toArray();

  if (collections) {
    for (const collection of collections) {
      await mongoose.connection.db.collection(collection.name).deleteMany({});
    }
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
};
