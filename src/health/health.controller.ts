import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('live')
  live(): { status: string } {
    return { status: 'ok' };
  }

  @Get()
  health(): Promise<{ status: string }> {
    return this.checkDatabase();
  }

  @Get('ready')
  ready(): Promise<{ status: string }> {
    return this.checkDatabase();
  }

  private async checkDatabase(): Promise<{ status: string }> {
    await this.connection.db?.command({ ping: 1 });
    return { status: 'ok' };
  }
}
