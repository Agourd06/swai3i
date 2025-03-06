import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

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

  it('should return success and user data on signup', async () => {
    const signupData = { username: 'testuser',email: 'email@email.com' , phone: '065599622', adress:'dzzdzdz', password: 'password123' };
    const mockUser = { id: 1, username: 'testuser' };
    mockAuthService.signup.mockResolvedValue(mockUser);

    const result = await controller.signup(signupData);

    expect(result).toEqual(mockUser);
    expect(mockAuthService.signup).toHaveBeenCalledWith(signupData);
  });

  it('should throw Error on signup failure', async () => {
    const signupData = { username: 'testuser',email: 'email@email.com' , phone: '065599622', adress:'dzzdzdz', password: 'password123' };
    mockAuthService.signup.mockRejectedValue(new Error('Signup failed'));

    await expect(controller.signup(signupData)).rejects.toThrow(
      Error,
    );
  });

  it('should return success and token on login', async () => {
    const loginData = { email: 'walid@gmail.com', password: 'password123' };
    const mockToken = { accessToken: 'valid_token' };
    mockAuthService.login.mockResolvedValue(mockToken);

    const result = await controller.login(loginData);

    expect(result).toEqual(mockToken);
    expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
  });

  it('should throw Error on login failure', async () => {
    const loginData = { email: 'walid@gmail.com', password: 'password123' };
    mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

    await expect(controller.login(loginData)).rejects.toThrow(
      Error,
    );
  });
});
