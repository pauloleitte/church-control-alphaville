import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DashboardService } from '../services/dashboard.service';
import { Roles } from '../../auth/decorators/role.decorator';
import { Role } from '../../auth/enums/role.enum';
import { FilterParams } from 'src/app/shared/utils/filter-params';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@Roles(Role.EBDAdmin, Role.Super)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('daily-report')
  async getDailyReport(@Query() params: FilterParams) {
    return await this.dashboardService.generateReportByDaily(params);
  }

  @Get('lighthouse-report')
  async getLightHouseReport(@Query() params: FilterParams) {
    return await this.dashboardService.getLightHouseByDaily(params);
  }
}
