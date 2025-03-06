import { IsString, IsOptional, Matches, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../../common/enums/users.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly adress?: string;

  @IsEnum(UserRole)
  @IsOptional()
  readonly role?: UserRole;
}
