import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return { service: 'highland-destinations-backend', status: 'ok' };
  }
}
