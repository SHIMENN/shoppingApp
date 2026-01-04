import { IsNumber,IsString } from 'class-validator';

export class CreateCartDto {
    @IsNumber()
    userId:number;

    @IsString()
    CreatedAt:string;
}