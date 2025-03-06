import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ClassroomsService } from './class-room.service';
import { CreateClassroomDto } from './dto/create-class-room.dto';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  async create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomsService.create(createClassroomDto);
  }

  @Get()
  async findAll() {
    return this.classroomsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.classroomsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateClassroomDto: Partial<CreateClassroomDto>) {
    return this.classroomsService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.classroomsService.remove(id);
  }

  @Get('course/:courseId')
  async findByCourseId(@Param('courseId') courseId: string) {
    return this.classroomsService.findByCourseId(courseId);
  }
}