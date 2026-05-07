import { Server } from 'node:http';
import path from 'node:path';
import dotenv from 'dotenv';
import { createApp } from './app';
import { initLogger } from './modules/logger';
import { connect, closeDB } from './repositories/mongoose';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

let server: Server | null = null;

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

    connect({
      uri: DB_URI,
      user: DB_USER,
      password: DB_PASSWORD,
      name: DB_NAME,
    })
    .then(() => {
    const logsPath = path.join(__dirname, 'logs');
    const logger = initLogger(logsPath);
    const app = createApp({ loggerInstance: logger });

    logger.info('✅ Connected to MongoDB');

    server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
    });
    })
    .catch ((error) => {
    console.error('Failed to connect to database', { error });
    throw new Error('Failed to connect to database');
  });
  } catch (error) {
  console.error('❌ Failed to start the application', { error });

  process.exit(1);
}

const closeServer = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) return reject(err);
        console.log('HTTP server closed.');
        resolve();
      });
    } else {
      resolve();
    }
  });
};

const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  
  const timeout = setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');

    process.exit(1);
  }, 10000)

  try {
    await closeServer();
    await closeDB();

    clearTimeout(timeout);

    console.log('Graceful shutdown finished. Bye!');

    process.exit(0);

  } catch (e) {
    console.error('Error during shutdown', { error: e });
    process.exit(1);
  }
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});
