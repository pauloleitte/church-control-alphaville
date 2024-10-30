import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private mongooseHealthIndicator: MongooseHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () =>
        this.mongooseHealthIndicator.pingCheck('mongodb', { timeout: 1000 }),
    ]);
  }
}

export default HealthController;
