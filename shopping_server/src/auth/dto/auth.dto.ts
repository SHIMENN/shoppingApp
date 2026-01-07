import { IsEmail, IsString,  MinLength } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

// Registration DTO
export class RegisterDto extends CreateUserDto{};
// Login DTO


export class LoginDto {
  @IsString()
  @IsEmail()
 email: string;

  @IsString()
  password: string;
}
