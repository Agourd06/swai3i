import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseType } from './courses.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { DayOfWeek } from './dto/time-slot.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    this.validateCourseTypeRequirements(createCourseDto);
    this.validateTimeSlots(createCourseDto);
    
    const createdCourse = new this.courseModel({
      ...createCourseDto,
      timeSlots: createCourseDto.timeSlots.map(slot => ({
        day: slot.day,
        hour: slot.hour,
        minute: slot.minute
      }))
    });

    return createdCourse.save();
  }

  private validateCourseTypeRequirements(courseDto: CreateCourseDto) {
    courseDto.courseType.forEach(type => {
      switch (type) {
        case CourseType.PRIVATE:
        case CourseType.CLASSROOM:
          if (!courseDto.location) {
            throw new BadRequestException(`Location is required for ${type} courses`);
          }
          if (type === CourseType.CLASSROOM && !courseDto.maxStudents) {
            throw new BadRequestException('Maximum number of students is required for classroom courses');
          }
          break;
        case CourseType.ONLINE:
          break;
      }
    });
  }

  private validateTimeSlots(courseDto: CreateCourseDto) {
    if (!courseDto.timeSlots || courseDto.timeSlots.length === 0) {
      throw new BadRequestException('At least one time slot is required');
    }

    if (!courseDto.startDate || !courseDto.endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    if (courseDto.startDate >= courseDto.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Check for duplicate time slots
    const timeSlotStrings = courseDto.timeSlots.map(
      slot => `${slot.day}-${slot.hour}-${slot.minute}`
    );
    const uniqueTimeSlots = new Set(timeSlotStrings);
    if (timeSlotStrings.length !== uniqueTimeSlots.size) {
      throw new BadRequestException('Duplicate time slots are not allowed');
    }
  }

  async findAll(filters: {
    subject?: string;
    level?: string;
    city?: string;
    teacher?: string;
    courseType?: CourseType;
  }): Promise<Course[]> {
    const query: any = {};
    
    if (filters.courseType) {
      query.courseType = { $in: [filters.courseType] };
    }
    if (filters.subject) query['subject'] = filters.subject;
    if (filters.level) query['level'] = filters.level;
    if (filters.city) query['city'] = filters.city;
    if (filters.teacher) query['teacher'] = filters.teacher;

    return this.courseModel.find(query)
      .populate('teacher', 'username email')
      .exec();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id)
      .populate('teacher', 'username email')
      .exec();
    
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: Partial<CreateCourseDto>): Promise<Course> {
    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .exec();
    
    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return updatedCourse;
  }

  async remove(id: string): Promise<Course> {
    const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();
    
    if (!deletedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return deletedCourse;
  }

  // Helper method to get all class sessions for a course
  async getCourseSessions(courseId: string): Promise<Date[]> {
    const course = await this.findOne(courseId);
    const sessions: Date[] = [];

    for (let date = new Date(course.startDate); 
         date <= course.endDate; 
         date.setDate(date.getDate() + 1)) {
      
      const dayOfWeek = this.getDayOfWeek(date);
      
      const matchingTimeSlots = course.timeSlots.filter(
        slot => slot.day === dayOfWeek
      );

      for (const timeSlot of matchingTimeSlots) {
        const sessionDate = new Date(date);
        sessionDate.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
        sessions.push(sessionDate);
      }
    }

    return sessions.sort((a, b) => a.getTime() - b.getTime());
  }

  private getDayOfWeek(date: Date): DayOfWeek {
    const days = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY
    ];
    return days[date.getDay()];
  }

  async findCoursesByTeacherId(teacherId: string): Promise<Course[]> {
    try {
      const courses = await this.courseModel.find({ teacher: teacherId })
        .populate('teacher', 'username email')
        .populate({
          path: 'enrollments',
          model: 'Enrollment',
          populate: {
            path: 'student',
            model: 'User',
            select: 'username email'
          }
        })
        .exec();

      if (!courses) {
        throw new NotFoundException(`No courses found for teacher ${teacherId}`);
      }

      return courses;
    } catch (error) {
      throw new BadRequestException(`Error finding courses: ${error.message}`);
    }
  }
} 