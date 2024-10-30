import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitorController } from './controllers/visitor.controller';
import { VisitorSchema } from './schema/visitor.schema';
import { VisitorService } from './services/visitor.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Visitor', schema: VisitorSchema }]),
  ],
  controllers: [VisitorController],
  providers: [VisitorService],
  exports: []
})
export class VisitorModule { }
