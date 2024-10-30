import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notification.service';

@Module({
  imports: [],
  controllers: [],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class SharedModule {}
