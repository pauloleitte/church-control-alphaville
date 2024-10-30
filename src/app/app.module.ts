import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { CeremonyModule } from './features/ceremony/ceremony.module';
import { DepartmentModule } from './features/department/department.module';
import { HealthModule } from './features/health/health.module';
import { MemberModule } from './features/member/member.module';
import { NoticeModule } from './features/notice/notice.module';
import { PrayerModule } from './features/prayer/prayer.module';
import { UserModule } from './features/user/user.module';
import { VisitorModule } from './features/visitor/visitor.module';
import { SharedModule } from './shared/shared.module';
import { StudentModule } from './features/student/student.module';
import { LessonModule } from './features/lesson/lesson.module';
import { GroupModule } from './features/group/group.module';
import { DashBoardModule } from './features/dashboard/dashboard.module';
import { RateLimiterMiddleware } from './shared/middleware/rate-limit.middleware';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    AuthModule,
    HealthModule,
    UserModule,
    VisitorModule,
    CeremonyModule,
    NoticeModule,
    MemberModule,
    DepartmentModule,
    PrayerModule,
    SharedModule,
    StudentModule,
    LessonModule,
    GroupModule,
    DashBoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('*');
  }
}
