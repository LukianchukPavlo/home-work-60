import path from 'node:path';
import dotenv from 'dotenv';
import { createApp } from './app';
import { initLogger } from './modules/logger';
import { connect } from './repositories/mongo-db/base';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function bootstrap() {
  try {
    const {
      PORT,
      DB_URI,
      DB_USER,
      DB_PASSWORD,
      DB_NAME,
      JWT_SECRET_KEY,
      COOKIE_SECRET_KEY,
      CLIENT_URLS,
    } = process.env;

    if (!PORT) {
      throw new Error('PORT is not defined in environment variables');
    }

    if (!DB_URI || !DB_USER || !DB_PASSWORD || !DB_NAME) {
      throw new Error('MongoDB env variables are not fully defined');
    }

    if (!JWT_SECRET_KEY || !COOKIE_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY or COOKIE_SECRET_KEY is not defined');
    }

    if (!CLIENT_URLS) {
      throw new Error('CLIENT_URLS is not defined');
    }

    await connect({
      uri: DB_URI,
      user: DB_USER,
      password: DB_PASSWORD,
      name: DB_NAME,
    });

    const logsPath = path.join(__dirname, 'logs');
    const logger = initLogger(logsPath);

    logger.info('✅ Connected to MongoDB');

  
    const app = createApp({ loggerInstance: logger });

    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start the application', { error });
    process.exit(1);
  }
}

bootstrap();