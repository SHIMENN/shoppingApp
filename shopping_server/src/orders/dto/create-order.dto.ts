import { IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    totalAmount: number;

    @IsOptional()
    @IsString()
    status?: string;
}
