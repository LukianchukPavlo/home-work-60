import dotenv from 'dotenv';
import path from 'path';
import { connect } from '../repositories/mongo-db/base';
import { seed } from './seed';

dotenv.config({ path: path.join(__dirname, '../../.env') });

(async () => {
  try {
    await connect({
      uri: process.env.DB_URI!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      name: process.env.DB_NAME!,
    });

    await seed();

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();