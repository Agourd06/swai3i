import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomsService } from './class-room.service';
import { getModelToken } from '@nestjs/mongoose';
import { Classroom } from './class-room.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('ClassroomsService', () => {
  let service: ClassroomsService;
  let model: Model<Classroom>;

  const mockClassroom = {
    _id: 'classroom1',
    course: 'course1',
    capacity: 30,
    location: 'Room 101'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassroomsService,
        {
          provide: getModelToken(Classroom.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockClassroom),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          }
        },
      ],
    }).compile();

    service = module.get<ClassroomsService>(ClassroomsService);
    model = module.get<Model<Classroom>>(getModelToken(Classroom.name));
  });

  describe('create', () => {
    it('should create a classroom', async () => {
      const createClassroomDto = {
        course: 'course1',
        capacity: 30,
        location: 'Room 101'
      };

      (model.create as jest.Mock).mockResolvedValue(mockClassroom);

      const result = await service.create(createClassroomDto);
      expect(result).toEqual(mockClassroom);
    });
  });

  describe('findAll', () => {
    it('should return array of classrooms', async () => {
      (model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockClassroom])
      });

      const result = await service.findAll();
      expect(result).toEqual([mockClassroom]);
    });
  });

  describe('findOne', () => {
    it('should return a classroom', async () => {
      (model.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockClassroom)
      });

      const result = await service.findOne('classroom1');
      expect(result).toEqual(mockClassroom);
    });

    it('should throw NotFoundException if classroom not found', async () => {
      (model.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null)
      });

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
