import { IsEmail, IsString,  MinLength } from 'class-validator';

// Registration DTO
export class RegisterDto{
  @IsString()
  @MinLength(3)
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
}



export class LoginDto {
  @IsString()
  @IsEmail()
 email: string;

  @IsString()
  password: string;
}
