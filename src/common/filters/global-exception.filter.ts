import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';

export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const statusCode = this.getStatusCode(error);
    const message = this.getMessage(error);
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
  }

  private getStatusCode(error: unknown): number {
    if (error instanceof HttpError) return error.statusCode;
    if (error instanceof HttpException) return error.getStatus();
    return 500;
  }

  private getMessage(error: unknown): string {
    if (error instanceof HttpError) return error.message;
    if (error instanceof HttpException) {
      const exceptionResponse = error.getResponse();
      return typeof exceptionResponse === 'string' ? exceptionResponse : error.message;
    }
    return 'Internal server error';
  }
}
