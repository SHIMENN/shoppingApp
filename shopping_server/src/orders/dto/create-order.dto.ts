import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  shipping_address?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
