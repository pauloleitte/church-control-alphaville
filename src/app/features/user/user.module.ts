import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { BcryptService } from '../../shared/services/bcrypt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.shema';
import { UserService } from './services/user.service';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    LessonModule
  ],
  controllers: [UserController],
  providers: [BcryptService, UserService],
  exports: [UserService]
})
export class UserModule { }
