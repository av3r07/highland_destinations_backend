import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { getConfiguration } from './config/configuration';
import { HealthModule } from './health/health.module';
import { ContactInquiriesModule } from './modules/contact-inquiries/contact-inquiries.module';
import { StatusController } from './modules/status/status.controller';

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
