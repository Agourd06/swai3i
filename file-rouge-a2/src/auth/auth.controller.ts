import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { SignupDto } from './dto/Signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }



  @Post('signup')
  async signup(@Body() signupData: SignupDto) {


    try {
      return this.authService.signup(signupData);
    } catch (error) {

      throw new BadRequestException('Failed to Signup');
    }
  }



  @Post('login')
  async login(@Body() loginData: LoginDto) {

    try {
      return this.authService.login(loginData);
    } catch (error) {

      throw new BadRequestException('Failed to Login');
    }
  }


}