import { IsString, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  sender: Types.ObjectId;

  @IsMongoId()
  receiver: Types.ObjectId;

  @IsMongoId()
  course: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  room: string;
}
