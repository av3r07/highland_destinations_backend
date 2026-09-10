import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { getConfiguration } from './config/configuration.js';
import { HealthModule } from './health/health.module.js';
import { ContactInquiriesModule } from './modules/contact-inquiries/contact-inquiries.module.js';
import { StatusController } from './modules/status/status.controller.js';

const config = getConfiguration();

@Module({
  imports: [
    MongooseModule.forRoot(config.database.uri, {
      maxPoolSize: config.database.maxPoolSize,
      minPoolSize: config.database.minPoolSize,
      serverSelectionTimeoutMS: config.database.serverSelectionTimeoutMs,
      connectTimeoutMS: config.database.connectTimeoutMs,
      socketTimeoutMS: config.database.socketTimeoutMs,
    }),
    HealthModule,
    ContactInquiriesModule,
  ],
  controllers: [AppController, StatusController],
})
export class AppModule {}
