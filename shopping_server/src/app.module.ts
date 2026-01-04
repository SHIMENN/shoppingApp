import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemModule } from './order-item/order-item.module';
import { CartItemModule } from './cart-item/cart-item.module';

@Module({
  imports: [ UsersModule, ProductsModule, CartsModule, OrdersModule, OrderItemModule, CartItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
