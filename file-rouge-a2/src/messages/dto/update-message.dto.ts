import { IsString, IsOptional, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class UpdateMessageDto {

    @IsOptional()
    @IsString()
    content?: string;

    @IsNotEmpty()  
    @IsString()
   readonly channel: Types.ObjectId;

    @IsNotEmpty()  
    @IsString()
   readonly sender: Types.ObjectId;
   
//     @IsNotEmpty()  
//     @IsString()
//    readonly recipient: Types.ObjectId;

}
