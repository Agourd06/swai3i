import { IsString, IsEmail, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../common/enums/users.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsOptional() 
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly adress: string;

  @IsEnum(UserRole)
  @IsOptional() 
  readonly role: UserRole;
}