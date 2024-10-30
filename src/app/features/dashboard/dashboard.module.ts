import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [LessonModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [],
})
export class DashBoardModule {}
