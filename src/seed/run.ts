import dotenv from 'dotenv';
import path from 'path';
import { connect } from '../connect';
import { seed } from './seed';

dotenv.config({ path: path.join(__dirname, '../../.env') });

(async () => {
  try {
    await connect(process.env.MONGODB_URI!, process.env.DB_NAME!);

    await seed();

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();