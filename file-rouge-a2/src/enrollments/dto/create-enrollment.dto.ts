import { IsMongoId, IsEnum, IsOptional, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { EnrollmentStatus } from '../enrollment-status.enum';
export class CreateEnrollmentDto {
  @IsMongoId()
  @IsNotEmpty()
  course: string;

  @IsMongoId()
  @IsNotEmpty()
  student: string;

  @IsString()
  @IsOptional()
  classroom?: string;

 

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(EnrollmentStatus)
  @IsOptional()
  status?: EnrollmentStatus;

  @IsOptional()
  timeSlots?: any[];
} 