import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { UserRole } from '../common/enums/users.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService;

  beforeEach(async () => {
    mockAuthService = {
      signup: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    const signupDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      adress: 'Test Address',
      role: UserRole.STUDENT
    };

    it('should successfully create a new user', async () => {
      const expectedResponse = {
        access_token: 'mock_token'
      };
      mockAuthService.signup.mockResolvedValue(expectedResponse);

      const result = await controller.signup(signupDto);
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signup).toHaveBeenCalledWith(signupDto);
    });

    it('should throw BadRequestException when signup fails', async () => {
      mockAuthService.signup.mockRejectedValue(new BadRequestException('Signup failed'));
      await expect(controller.signup(signupDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should successfully login user', async () => {
      const expectedResponse = {
        access_token: 'mock_token',
        user: { id: '1', email: 'test@example.com' }
      };
      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw BadRequestException when login fails', async () => {
      mockAuthService.login.mockRejectedValue(new BadRequestException('Login failed'));
      await expect(controller.login(loginDto)).rejects.toThrow(BadRequestException);
    });
  });
});
