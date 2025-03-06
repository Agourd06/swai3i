import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "../../common/enums/users.enum";

export class SignupDto {

    @IsString()
    @IsNotEmpty()
    readonly username: string;
  
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
  
    @IsString()
    @IsNotEmpty()
    readonly password: string;
  
    @IsString()
    @IsNotEmpty()
    readonly phone: string;
  
    @IsString()
    @IsNotEmpty()
    readonly adress: string;
  
    @IsEnum(UserRole)
    @IsOptional() 
    readonly role?: UserRole;


}