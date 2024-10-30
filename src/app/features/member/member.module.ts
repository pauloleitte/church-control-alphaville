import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberController } from './controllers/member.controller';
import { MemberSchema } from './schemas/member.schema';
import { MemberService } from './services/member.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports: []
})
export class MemberModule { }
