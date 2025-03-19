import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { CourseType } from './courses.schema';

describe('CoursesController', () => {
  let controller: CoursesController;
  let mockCoursesService;

  const mockCourse = {
    _id: 'course1',
    title: 'Test Course',
    description: 'Test Description',
    subject: 'Math',
    level: 'Beginner',
    courseType: CourseType.ONLINE,
    teacher: 'teacher1'
  };

  beforeEach(async () => {
    mockCoursesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findCoursesByTeacherId: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCoursesService
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          }
        },
        {
          provide: getModelToken('User'),
          useValue: {
            findById: jest.fn(),
          }
        }
      ]
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  describe('findAll', () => {
    it('should return array of courses', async () => {
      mockCoursesService.findAll.mockResolvedValue([mockCourse]);
      
      const result = await controller.findAll();
      expect(result).toEqual([mockCourse]);
    });

    it('should filter courses by query parameters', async () => {
      const queryParams = {
        subject: 'Math',
        level: 'Beginner',
        courseType: CourseType.ONLINE
      };

      mockCoursesService.findAll.mockResolvedValue([mockCourse]);
      
      const result = await controller.findAll(
        queryParams.subject,
        queryParams.level,
        undefined,
        undefined,
        queryParams.courseType
      );

      expect(result).toEqual([mockCourse]);
      expect(mockCoursesService.findAll).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('findOne', () => {
    it('should return a single course', async () => {
      mockCoursesService.findOne.mockResolvedValue(mockCourse);
      
      const result = await controller.findOne('course1');
      expect(result).toEqual(mockCourse);
    });
  });
}); 