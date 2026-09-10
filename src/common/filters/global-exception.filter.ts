import type { ErrorRequestHandler } from 'express';

export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

export const globalExceptionHandler: ErrorRequestHandler = (error, request, response, _next) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof HttpError ? error.message : 'Internal server error';
  const details = error instanceof HttpError ? error.details : undefined;
  response.status(statusCode).json({
    statusCode,
    code: statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'HTTP_ERROR',
    message,
    ...(details ? { details } : {}),
    requestId: request.header('x-request-id'),
    timestamp: new Date().toISOString(),
    path: request.url,
  });
};
