import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class UpdateQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
