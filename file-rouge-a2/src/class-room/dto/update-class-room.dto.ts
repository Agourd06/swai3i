import { PartialType } from '@nestjs/mapped-types';
import { CreateClassroomDto } from './create-class-room.dto';

export class UpdateClassRoomDto extends PartialType(CreateClassroomDto) {}
