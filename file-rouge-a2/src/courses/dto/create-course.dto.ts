import { IsString, IsNumber, IsArray, IsMongoId, IsBoolean, IsOptional, IsEnum, Min, IsDate, ValidateNested } from 'class-validator';
import { CourseType } from '../courses.schema';
import { TimeSlotDto } from './time-slot.dto';
import { Type } from 'class-transformer';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  subject: string;

  @IsString()
  level: string;

  @IsString()
  city: string;

  @IsMongoId()
  teacher: string;

  @IsNumber()
  // @Min(0)
  price: number;

  @IsNumber()
  // @Min(0)
  duration: number;

  @IsEnum(CourseType, { each: true })
  courseType: CourseType[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  maxStudents?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots: TimeSlotDto[];

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 