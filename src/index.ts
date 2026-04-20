import path from 'node:path';
import dotenv from 'dotenv';
import { createApp } from './app';
import { initLogger } from './modules/logger';
import { connect } from './repositories/json-db/base';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

try {
  const { PORT, DB_URI, DB_PORT, JWT_SECRET_KEY, COOKIE_SECRET_KEY, CLIENT_URLS } = process.env;
  
  if (!PORT) {
    console.error('PORT is not defined in environment variables');

    throw new Error('PORT is not defined in environment variables');
  }

  if (!DB_URI || !DB_PORT) {
    console.error('DB_URI or DB_PORT is not defined in environment variables');

    throw new Error('DB_URI or DB_PORT is not defined in environment variables');
  }

  if (!JWT_SECRET_KEY || !COOKIE_SECRET_KEY) {
    console.error('JWT_SECRET_KEY or COOKIE_SECRET_KEY is not defined in environment variables');

    throw new Error('JWT_SECRET_KEY or COOKIE_SECRET_KEY is not defined in environment variables');
  }

  if (!CLIENT_URLS) {
    console.error('CLIENT_URLS is not defined in environment variables');

    throw new Error('CLIENT_URLS is not defined in environment variables');
  }

  connect(`${DB_URI}:${DB_PORT}`)
    .then(() => {

      const logsPath = path.join(__dirname, 'logs');
      const logger = initLogger(logsPath);
      const app = createApp({ loggerInstance: logger });

      logger.info('Connected to JSON Server database');

      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to connect to JSON Server database', { error });

      throw new Error('Failed to connect to JSON Server database');
    });

} catch (error) {
  console.error('Failed to start the application', { error });

  process.exit(1);
}
