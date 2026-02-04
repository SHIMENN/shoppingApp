import { IsEmail, IsString, MinLength, IsOptional, IsEnum} from 'class-validator';
import { UserRole } from '../enums/roles.enum';



export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    user_name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
