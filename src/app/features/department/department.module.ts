import { DepartmentService } from './services/department.service';
import { DepartmentController } from './controllers/department.controller';
import { DepartmentSchema } from './schema/department.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Department', schema: DepartmentSchema },
    ]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [],
})
export class DepartmentModule {}
