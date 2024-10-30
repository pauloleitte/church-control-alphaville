import { Module } from '@nestjs/common';
import { LessonController } from './controllers/lesson.controller';
import { LessonService } from './services/lesson.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonSchema } from './schemas/lesson.schema';
import { GroupSchema } from '../group/schemas/group.schema';
import { GroupService } from '../group/services/group.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Lesson', schema: LessonSchema },
      { name: 'Group', schema: GroupSchema },
    ]),
  ],
  providers: [LessonService, GroupService],
  controllers: [LessonController],
  exports: [LessonService],
})
export class LessonModule {}
