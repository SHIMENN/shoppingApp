import { IsNotEmpty, IsString, IsNumber, IsPositive, Min} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;


    @Type(()=> Number)
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;


    @Type(()=> Number)
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock: number;

}
