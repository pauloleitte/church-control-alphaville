import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrayerController } from './controllers/prayer.controller';
import { PrayerSchema } from './schemas/prayer.schemas';
import { PrayerService } from './services/prayer.service';
import { UserModule } from '../user/user.module';
import { SharedModule } from 'src/app/shared/shared.module';

@Module({
  imports: [
    UserModule,
    SharedModule,
    MongooseModule.forFeature([{ name: 'Prayer', schema: PrayerSchema }]),
  ],
  controllers: [PrayerController],
  providers: [PrayerService],
  exports: [],
})
export class PrayerModule {}
