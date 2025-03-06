import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User as UserModel } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  async createUser(data: CreateUserDto, eventId: string): Promise<UserModel> {
    const existingUser = await this.userModel.findOne({ email: data.email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
  
    const newUser = new this.userModel(data);
    await newUser.save();
  
    return newUser;
  }
  
  
  async findAll(): Promise<UserModel[]> {
    try {
        return await this.userModel.find({ role: 'etudiant' }).exec();
    } catch (error) {
        console.error('Error fetching etudiants:', error);
        throw new Error('Could not fetch etudiants');
    }
}

  async findOne(id: string): Promise<UserModel> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserModel> {
    return await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async deleteUser(id: string): Promise<UserModel> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async addFavoriteTeacher(studentId: string, teacherId: string): Promise<UserModel> {
    const student = await this.userModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (!student.favoriteTeachers.includes(new Types.ObjectId(teacherId))) {
      student.favoriteTeachers.push(new Types.ObjectId(teacherId));
      await student.save();
    }
    return student;
  }

  async removeFavoriteTeacher(studentId: string, teacherId: string): Promise<UserModel> {
    const student = await this.userModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    student.favoriteTeachers = student.favoriteTeachers.filter(
      id => id.toString() !== teacherId
    );
    return student.save();
  }

  async getFavoriteTeachers(studentId: string): Promise<User[]> {
    const student = await this.userModel.findById(studentId)
      .populate<{ favoriteTeachers: User[] }>('favoriteTeachers', 'username email bio subjects')
      .exec();
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student.favoriteTeachers as User[];
  }
}
