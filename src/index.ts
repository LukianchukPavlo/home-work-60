import path from 'node:path';
import dotenv from 'dotenv';
import { createApp } from './app';
import { initLogger } from './modules/logger';
import { connect } from './connect';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { MONGODB_URI, PORT } = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI missing');
}

if (!PORT) {
  throw new Error('PORT missing');
}

const logger = initLogger(path.join(__dirname, 'logs'));

const app = createApp({ loggerInstance: logger });

(async () => {
  try {
    await connect(MONGODB_URI, 'task-manager');

    console.log('DB OK');

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    console.error('DB error:', err);
    process.exit(1);
  }
})();
