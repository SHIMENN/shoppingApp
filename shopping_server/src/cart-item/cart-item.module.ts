import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { Product } from '../products/entities/product.entity';


@Module({
  imports: [TypeOrmModule.forFeature([CartItem, ])],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
