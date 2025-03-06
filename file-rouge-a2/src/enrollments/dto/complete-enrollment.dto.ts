import { IsBoolean, IsEnum } from 'class-validator';
import { EnrollmentStatus } from '../enrollment-status.enum';

export class CompleteEnrollmentDto {
  @IsBoolean()
  isPaid: boolean;

  @IsEnum(EnrollmentStatus)
  status: EnrollmentStatus;
} 