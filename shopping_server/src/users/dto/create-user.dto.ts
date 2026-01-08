import { IsEmail, IsString, MinLength,IsNotEmpty,IsIn, IsEnum } from 'class-validator';
import { UserRole } from '../enums/roles.enum';


export class CreateUserDto {
    @IsString()
    userId: number;

    @IsString()
    @MinLength(3)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    createdAt: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;
}
  