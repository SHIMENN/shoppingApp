import { IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateOrderItemDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;
}
