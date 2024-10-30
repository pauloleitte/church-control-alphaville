import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoticeController } from './controllers/notice.controller';
import { NoticeSchema } from './schemas/notice.schemas';
import { NoticeService } from './services/notice.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Notice', schema: NoticeSchema }]),
  ],
  controllers: [NoticeController],
  providers: [NoticeService],
  exports: []
})
export class NoticeModule { }
