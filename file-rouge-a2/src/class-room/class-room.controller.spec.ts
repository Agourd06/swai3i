import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomsController } from './class-room.controller';
import { ClassroomsService } from './class-room.service';

describe('ClassroomsController', () => {
  let controller: ClassroomsController;
  let service: ClassroomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassroomsController],
      providers: [{
        provide: ClassroomsService,
        useValue: {
          findAll: jest.fn(),
          findOne: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
        }
      }],
    }).compile();

    controller = module.get<ClassroomsController>(ClassroomsController);
    service = module.get<ClassroomsService>(ClassroomsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
