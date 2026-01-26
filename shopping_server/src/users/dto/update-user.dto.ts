import { IsEmail, IsString, MinLength, IsOptional} from 'class-validator';



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
}
