import { Request, Response } from 'express';
import { createApp } from '../src/app.bootstrap.js';

let appPromise: ReturnType<typeof createApp> | undefined;

export default async function handler(request: Request, response: Response): Promise<void> {
  appPromise ??= createApp();
  const app = await appPromise;
  const expressApp = app.getHttpAdapter().getInstance() as (
    request: Request,
    response: Response,
  ) => void;
  expressApp(request, response);
}
