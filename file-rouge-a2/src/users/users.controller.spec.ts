import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UsersService } from './users.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUsersService;

  const mockUser = {
    _id: '1',
    username: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    mockUsersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UsersService,
        useValue: mockUsersService
      }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateDto = { username: 'updated username' };
      const updatedUser = { ...mockUser, ...updateDto };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);
      const result = await controller.updateUser('1', updateDto);
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUsersService.deleteUser.mockResolvedValue(mockUser);
      const result = await controller.deleteUser('1');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith('1');
    });
  });
});
