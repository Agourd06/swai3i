import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/Signup.dto';
import { LoginDto } from './dto/Login.dto';
import { User } from '../users/users.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async signup(signupData: SignupDto) {
    const { email, password, username, role, phone, adress } = signupData;

    const emailIsExisting = await this.userModel.findOne({ email });

    if (emailIsExisting) {
      throw new BadRequestException('Email already exists');
    }

 

    const newUser = new this.userModel({
      username,
      email,
      password,  
      role,
      adress,
      phone,
    });

    await newUser.save();

    const tokens = await this.generateUserTokens(newUser);
    return {
      ...tokens,
    };
  }

  async login(loginData: LoginDto) {
    const { email, password } = loginData;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Wrong Credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Wrong Credentials password');
    }

    const tokens = await this.generateUserTokens(user);

    return {
      ...tokens,
      user: user, 
    };
  }

  async generateUserTokens(user: User) {
    const payload = { id: user._id, role: user.role };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h', 
    });

    return {
      access_token,  
    };
  }
}
