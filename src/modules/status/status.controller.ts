import { Controller, Get } from '@nestjs/common';

@Controller('status')
export class StatusController {
  @Get()
  getStatus() {
    return { data: { service: 'highland-destinations-backend', status: 'ok' } };
  }
}
