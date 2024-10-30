import { Module } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controller';
import { StudentSchema } from './schemas/student.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from '../group/schemas/group.schema';
import { GroupService } from '../group/services/group.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: 'Group', schema: GroupSchema },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService, GroupService],
})
export class StudentModule {}
