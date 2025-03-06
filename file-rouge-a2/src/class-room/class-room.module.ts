import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Classroom, ClassroomSchema } from './class-room.schema';
import { ClassroomsController } from './class-room.controller';
import { ClassroomsService } from './class-room.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Classroom.name, schema: ClassroomSchema }]),
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
  exports: [ClassroomsService, MongooseModule],
})
export class ClassroomsModule {}