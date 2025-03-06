import { IsEnum, IsNumber, IsInt, Min, Max } from 'class-validator';

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export class TimeSlotDto {
  @IsEnum(DayOfWeek)
  day: DayOfWeek;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(23)
  hour: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(59)
  minute: number;
} 