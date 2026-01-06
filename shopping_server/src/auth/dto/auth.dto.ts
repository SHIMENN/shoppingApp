import { IsEmail, IsString,  MinLength } from 'class-validator';

// Registration DTO
export class RegisterDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// Login DTO
export class LoginDto {
  @IsString()
  @IsEmail()
 email: string;

  @IsString()
  password: string;
}
