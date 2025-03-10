import { IsString, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  sender: Types.ObjectId;

  @IsNotEmpty()
  receiver: Types.ObjectId;

  @IsMongoId()
  course: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  room: string;
}
