import Joi from 'joi';
import type { NodeEnvironment } from './configuration.types.js';

export interface EnvironmentVariables {
  NODE_ENV: NodeEnvironment;
  PORT: number;
  MONGODB_URI: string;
  MONGODB_MAX_POOL_SIZE: number;
  MONGODB_MIN_POOL_SIZE: number;
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: number;
  MONGODB_CONNECT_TIMEOUT_MS: number;
  MONGODB_SOCKET_TIMEOUT_MS: number;
  CORS_ORIGINS: string;
  RATE_LIMIT_TTL_MS: number;
  RATE_LIMIT_MAX: number;
  LOG_LEVEL: string;
}

const environmentValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  MONGODB_URI: Joi.string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .required(),
  MONGODB_MAX_POOL_SIZE: Joi.number().integer().min(1).default(20),
  MONGODB_MIN_POOL_SIZE: Joi.number().integer().min(0).default(2),
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: Joi.number().integer().positive().default(5000),
  MONGODB_CONNECT_TIMEOUT_MS: Joi.number().integer().positive().default(5000),
  MONGODB_SOCKET_TIMEOUT_MS: Joi.number().integer().positive().default(45000),
  CORS_ORIGINS: Joi.string().allow('').default(''),
  RATE_LIMIT_TTL_MS: Joi.number().integer().positive().default(60000),
  RATE_LIMIT_MAX: Joi.number().integer().positive().default(100),
  LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace').default('info'),
});

export function validateEnvironment(): EnvironmentVariables {
  const { error, value } = environmentValidationSchema.validate(process.env, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (error) throw new Error(`Environment validation failed: ${error.message}`);
  return value as EnvironmentVariables;
}
