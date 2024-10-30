import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CeremonyController } from './controllers/ceremony.controller';
import { CeremonySchema } from './schema/ceremony.schema';
import { CeremonyService } from './services/ceremony.service';
import { UserService } from '../user/services/user.service';
import { NotificationsService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    SharedModule,
    MongooseModule.forFeature([{ name: 'Ceremony', schema: CeremonySchema }]),
  ],
  controllers: [CeremonyController],
  providers: [CeremonyService],
})
export class CeremonyModule {}
