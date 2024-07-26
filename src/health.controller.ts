import { Controller, Get } from '@nestjs/common';

@Controller('/patients/health')
export class HealthController {
  @Get()
  getHealthStatus(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
