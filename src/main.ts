import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import pino from 'pino';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { requestId } from './common/middleware/request-id.middleware';
import { getConfiguration } from './config/configuration';

const config = getConfiguration();
const logger = pino({ level: config.logging.level });
const requestCounts = new Map<string, { count: number; expiresAt: number }>();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.use(requestId);
  app.use(helmet());
  app.use(cors);
  app.use(rateLimit);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(config.port, '0.0.0.0');
  logger.info({ port: config.port }, 'Application listening');
}

function cors(request: Request, response: Response, next: NextFunction): void {
  const origin = request.headers.origin;
  if (origin && config.corsOrigins.includes(origin)) {
    response.setHeader('access-control-allow-origin', origin);
    response.setHeader('access-control-allow-headers', 'Content-Type, X-Request-Id');
    response.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS');
  }
  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }
  next();
}

function rateLimit(request: Request, response: Response, next: NextFunction): void {
  const now = Date.now();
  const key = request.ip ?? 'unknown';
  const current = requestCounts.get(key);
  const entry =
    current && current.expiresAt > now
      ? current
      : { count: 0, expiresAt: now + config.rateLimit.ttlMs };
  entry.count += 1;
  requestCounts.set(key, entry);
  if (entry.count > config.rateLimit.limit) {
    response
      .status(429)
      .json({ statusCode: 429, code: 'TOO_MANY_REQUESTS', message: 'Too many requests' });
    return;
  }
  next();
}

void bootstrap().catch((error: unknown) => {
  logger.error({ err: error }, 'Application failed to start');
  process.exitCode = 1;
});
