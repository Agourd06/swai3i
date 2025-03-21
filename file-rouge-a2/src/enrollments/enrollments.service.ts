import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from './enrollments.schema';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CoursesService } from '../courses/courses.service';
import { CompleteEnrollmentDto } from './dto/complete-enrollment.dto';
import { Classroom } from 'src/class-room/class-room.schema';
import { Course, CourseType } from '../courses/courses.schema';
import { EnrollmentStatus } from './enrollment-status.enum';
import { User } from '../users/users.schema';
import { UserRole } from 'src/common/enums/users.enum';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
    @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel('User') private userModel: Model<User>,
    private coursesService: CoursesService,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const { student, classroom,  price, timeSlots, status } = createEnrollmentDto;

    const studentUser = await this.userModel.findById(student);
    if (!studentUser || studentUser.role !== UserRole.STUDENT) {
      throw new BadRequestException('Invalid student ID');
    }

    const course = await this.courseModel.findById(createEnrollmentDto.course);
    if (!course) {
      throw new NotFoundException(`Course with ID ${createEnrollmentDto.course} not found`);
    }

    if (course.courseType.includes(CourseType.CLASSROOM)) {
      let existingClassroom = await this.classroomModel.findOne({ course: course._id });
      
      if (!existingClassroom) {
        existingClassroom = new this.classroomModel({
          course: course._id,
          capacity: 30,
        });
        await existingClassroom.save();
      }
      const currentEnrollments = await this.enrollmentModel.countDocuments({ classroom: existingClassroom._id });

      if (currentEnrollments >= existingClassroom.capacity) {
        throw new BadRequestException('Classroom is full');
      }
      const studentEnrolled = await this.enrollmentModel.findOne({ student: student, course: course._id });
      if (studentEnrolled) {
        throw new BadRequestException('Student is already enrolled in this course');
      }

      const enrollmentData = {
        student,
        classroom: existingClassroom._id,
      
        timeSlots,
        price,
        course: course._id,
        status: status || EnrollmentStatus.PENDING, 
      };
      console.log('enrollmentData' , enrollmentData);
      
      const createdEnrollment = new this.enrollmentModel(enrollmentData);
      const savedEnrollment = await createdEnrollment.save();

      await this.courseModel.findByIdAndUpdate(
        course._id,
        { $push: { enrollments: savedEnrollment._id } }
      );

      return savedEnrollment;
    } else {
      const enrollmentData = {
        student,
        course: course._id,
        timeSlots,
        price,
        status: status || EnrollmentStatus.PENDING, 
      };
      console.log('enrollmentData' , enrollmentData);
      
      const createdEnrollment = new this.enrollmentModel(enrollmentData);
      const savedEnrollment = await createdEnrollment.save();

      await this.courseModel.findByIdAndUpdate(
        course._id,
        { $push: { enrollments: savedEnrollment._id } }
      );

      return savedEnrollment;
    }
  }

  async findAll(filters: {
    student?: string;
    course?: string;
    status?: EnrollmentStatus;
  }): Promise<Enrollment[]> {
    const query = {};
    
    if (filters.student) query['student'] = filters.student;
    if (filters.course) query['course'] = filters.course;
    if (filters.status) query['status'] = filters.status;

    return this.enrollmentModel.find(query)
      .populate({
        path: 'course',
        select: 'title description timeSlots startDate endDate price courseType teacher',
        populate: {
          path: 'teacher',
          select: 'username email'
        }
      })
      .populate('student', 'username email')
      .exec();
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentModel.findById(id)
      .populate({
        path: 'course',
        select: 'title description timeSlots startDate endDate price'
      })
      .populate('student', 'username email')
      .exec();

    if (!enrollment) {
      throw new NotFoundException(`Enrollment ${id} not found`);
    }

    return enrollment;
  }

  async updateStatus(id: string, status: EnrollmentStatus): Promise<Enrollment> {
    const enrollment = await this.enrollmentModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('course')
      .populate('student', 'username email')
      .exec();

    if (!enrollment) {
      throw new NotFoundException(`Enrollment ${id} not found`);
    }

    return enrollment;
  }

  async markAsPaid(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentModel
      .findByIdAndUpdate(id, 
        { 
          isPaid: true,
          status: EnrollmentStatus.ACTIVE 
        }, 
        { new: true }
      )
      .populate('course')
      .populate('student', 'username email')
      .exec();

    if (!enrollment) {
      throw new NotFoundException(`Enrollment ${id} not found`);
    }

    return enrollment;
  }

  async completeEnrollment(
    id: string, 
    completeEnrollmentDto: CompleteEnrollmentDto
  ): Promise<Enrollment> {
    const enrollment = await this.enrollmentModel
      .findByIdAndUpdate(
        id,
        {
          isPaid: completeEnrollmentDto.isPaid,
          status: completeEnrollmentDto.status
        },
        { new: true }
      )
      .populate({
        path: 'course',
        select: 'title description timeSlots startDate endDate price'
      })
      .populate('student', 'username email')
      .exec();

    if (!enrollment) {
      throw new NotFoundException(`Enrollment ${id} not found`);
    }

    return enrollment;
  }

  async remove(id: string): Promise<void> {
    const enrollment = await this.enrollmentModel.findById(id);
    if (!enrollment) {
      throw new NotFoundException(`Enrollment ${id} not found`);
    }

    // Remove the enrollment reference from the course
    await this.courseModel.findByIdAndUpdate(
      enrollment.course,
      { $pull: { enrollments: enrollment._id } }
    );

    // Delete the enrollment
    await this.enrollmentModel.findByIdAndDelete(id);
  }
} 