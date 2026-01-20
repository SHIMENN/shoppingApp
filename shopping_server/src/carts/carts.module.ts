import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';
import {CartItemModule} from '../cart-item/cart-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart,CartItem,Product]),
CartItemModule,
],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
