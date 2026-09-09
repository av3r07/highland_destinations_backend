import { AppConfiguration } from './configuration.types';
import { validateEnvironment } from './env.validation';

export function getConfiguration(): AppConfiguration {
  const environment = validateEnvironment();
  return {
    environment: environment.NODE_ENV,
    port: environment.PORT,
    corsOrigins: environment.CORS_ORIGINS.split(',')
      .map((origin) => origin.trim().replace(/\/+$/, ''))
      .filter(Boolean),
    rateLimit: { ttlMs: environment.RATE_LIMIT_TTL_MS, limit: environment.RATE_LIMIT_MAX },
    logging: { level: environment.LOG_LEVEL },
    database: {
      uri: environment.MONGODB_URI,
      maxPoolSize: environment.MONGODB_MAX_POOL_SIZE,
      minPoolSize: environment.MONGODB_MIN_POOL_SIZE,
      serverSelectionTimeoutMs: environment.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
      connectTimeoutMs: environment.MONGODB_CONNECT_TIMEOUT_MS,
      socketTimeoutMs: environment.MONGODB_SOCKET_TIMEOUT_MS,
    },
  };
}
