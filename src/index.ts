import path from 'node:path';
import dotenv from 'dotenv';
import { createApp } from './app';
import { initLogger } from './modules/logger';
import { connect } from './connect';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { MONGODB_URI, PORT, DB_NAME } = process.env;

if (!MONGODB_URI) throw new Error('MONGODB_URI missing');
if (!DB_NAME) throw new Error('DB_NAME missing');
if (!PORT) throw new Error('PORT missing');

const logger = initLogger(path.join(__dirname, 'logs'));

const app = createApp({ loggerInstance: logger });

(async () => {
  try {
    console.log('🚀 Starting server...');

    await connect(MONGODB_URI, DB_NAME);

    console.log('🔥 DB OK');

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ FATAL ERROR:', err);
    process.exit(1);
  }
})();
