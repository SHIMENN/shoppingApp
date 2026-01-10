import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateCartItemDto {
    @IsNotEmpty()
    @IsNumber()
    cartId: number;

    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: number;
}
