import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment, EnrollmentSchema } from './enrollments.schema';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';
import { ClassroomsModule } from 'src/class-room/class-room.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    CoursesModule,
    ClassroomsModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {} 