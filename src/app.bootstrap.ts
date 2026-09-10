import 'dotenv/config';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import pino from 'pino';
import { globalExceptionHandler, HttpError } from './common/filters/global-exception.filter.js';
import { requestId } from './common/middleware/request-id.middleware.js';
import { getConfiguration } from './config/configuration.js';
import { ContactInquiriesService } from './modules/contact-inquiries/contact-inquiries.service.js';
import { validateCreateContactInquiry } from './modules/contact-inquiries/contact-inquiries.dto.js';
import { contactInquirySchema } from './modules/contact-inquiries/contact-inquiry.schema.js';

export const config = getConfiguration();
export const logger = pino({ level: config.logging.level });
const requestCounts = new Map<string, { count: number; expiresAt: number }>();

export async function createApp(): Promise<Express> {
  await mongoose.connect(config.database.uri, {
    maxPoolSize: config.database.maxPoolSize,
    minPoolSize: config.database.minPoolSize,
    serverSelectionTimeoutMS: config.database.serverSelectionTimeoutMs,
    connectTimeoutMS: config.database.connectTimeoutMs,
    socketTimeoutMS: config.database.socketTimeoutMs,
  });

  const app = express();
  const contactInquiryModel =
    mongoose.models.ContactInquiry ?? mongoose.model('ContactInquiry', contactInquirySchema);
  const contactInquiries = new ContactInquiriesService(contactInquiryModel);

  app.use(express.json());
  app.use(requestId);
  app.use(helmet());
  app.use(cors);
  app.use(rateLimit);
  app.get('/', (_request, response) => {
    response.json({ service: 'highland-destinations-backend', status: 'ok' });
  });
  app.get('/api/v1/health/live', (_request, response) => {
    response.json({ status: 'ok' });
  });
  app.get(['/api/v1/health', '/api/v1/health/ready'], async (_request, response, next) => {
    try {
      await mongoose.connection.db?.command({ ping: 1 });
      response.json({ status: 'ok' });
    } catch (error: unknown) {
      next(error);
    }
  });
  app.get('/api/v1/status', (_request, response) => {
    response.json({ data: { service: 'highland-destinations-backend', status: 'ok' } });
  });
  app.post('/api/v1/contact-inquiries', async (request, response, next) => {
    try {
      const dto = validateCreateContactInquiry(request.body);
      const inquiry = await contactInquiries.create(dto);
      response.status(201).json({
        data: {
          id: inquiry._id.toString(),
          name: inquiry.name,
          mobileNumber: inquiry.mobileNumber,
          email: inquiry.email,
          requirements: inquiry.requirements,
          message: inquiry.message,
          createdAt: inquiry.createdAt,
        },
      });
    } catch (error: unknown) {
      next(error);
    }
  });
  app.use((_request, _response, next) => next(new HttpError(404, 'Not found')));
  app.use(globalExceptionHandler);
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
