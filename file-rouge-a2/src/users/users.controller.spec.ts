import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import { UserRole } from '../common/enums/users.enum';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';

describe('UserController', () => {
  let controller: UserController;
  let service: UsersService;

  const mockUser = {
    _id: '1',
    username: 'John Doe',
    email: 'johndoe@example.com',
    phone: '06564646',
    adress: 'jhgsgdh',
    password : '',
     role : 'admin' as UserRole
  };

  const mockUsersService = {
    createUser: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [
      //   MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
     
      // ],
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user for the given event ID', async () => {
      mockUsersService.createUser.mockResolvedValue(mockUser);

      const result = await controller.createUser('eventId123', {
        username: 'username',
    email: 'username@username.com',
    phone: '06564646',
    adress: 'jhgsgdh',
    password : '',
    role : "admin" as UserRole
      });

      expect(result).toEqual(mockUser);
      const { _id : _ , ...newObj} = mockUser
      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        newObj ,
        'eventId123',
      );
    });

    it('should throw an error if eventId is missing', async () => {
      await expect(controller.createUser('', {  username: 'username',
        email: 'username@username.com',
        phone: '06564646',
        adress: 'jhgsgdh',
        password : '',
        role : "admin" as UserRole})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const updatedUser = { ...mockUser, username: 'username username' };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser('1', { username: 'username username' });
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith('1', {
        username: 'username username',
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete the user and return it', async () => {
      mockUsersService.deleteUser.mockResolvedValue(mockUser);

      const result = await controller.deleteUser('1');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith('1');
    });
  });
});
