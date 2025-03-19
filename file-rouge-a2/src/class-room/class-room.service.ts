import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClassroomDto } from './dto/create-class-room.dto';
import { Classroom } from './class-room.schema';

@Injectable()
export class ClassroomsService {
  constructor(@InjectModel(Classroom.name) private classroomModel: Model<Classroom>) {}

  async create(createClassroomDto: CreateClassroomDto): Promise<Classroom> {
    return this.classroomModel.create(createClassroomDto);
  }

  async findAll(): Promise<Classroom[]> {
    return this.classroomModel.find().exec();
  }

  async findOne(id: string): Promise<Classroom> {
    const classroom = await this.classroomModel.findById(id).exec();
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    return classroom;
  }

  async update(id: string, updateClassroomDto: Partial<CreateClassroomDto>): Promise<Classroom> {
    const updatedClassroom = await this.classroomModel.findByIdAndUpdate(id, updateClassroomDto, { new: true }).exec();
    if (!updatedClassroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    return updatedClassroom;
  }

  async remove(id: string): Promise<Classroom> {
    const deletedClassroom = await this.classroomModel.findByIdAndDelete(id).exec();
    if (!deletedClassroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    return deletedClassroom;
  }

  async findByCourseId(courseId: string): Promise<Classroom[]> {
    return this.classroomModel.find({ course: courseId }).exec();
  }
}