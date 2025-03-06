import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

// @UseGuards(AuthGuard) 
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

 

  
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  } 

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser(id);
  }
}
