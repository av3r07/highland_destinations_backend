import { createApp, config, logger } from './app.bootstrap';

async function bootstrap(): Promise<void> {
  const app = await createApp();
  await app.listen(config.port, '0.0.0.0');
  logger.info({ port: config.port }, 'Application listening');
}

void bootstrap().catch((error: unknown) => {
  logger.error({ err: error }, 'Application failed to start');
  process.exitCode = 1;
});
