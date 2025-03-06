import { IsMongoId, IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateClassroomDto {
  @IsMongoId()
  course: string; 

  @IsNotEmpty()
  @IsString()
  location: string; 

//   @IsNotEmpty()
//   schedule: Date; 

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  capacity: number; 
}