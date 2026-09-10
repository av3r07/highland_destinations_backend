import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import pino from 'pino';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { requestId } from './common/middleware/request-id.middleware.js';
import { getConfiguration } from './config/configuration.js';

export const config = getConfiguration();
export const logger = pino({ level: config.logging.level });
const requestCounts = new Map<string, { count: number; expiresAt: number }>();

export async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.use(requestId);
  app.use(helmet());
  app.use(cors);
  app.use(rateLimit);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.init();
  return app;
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
