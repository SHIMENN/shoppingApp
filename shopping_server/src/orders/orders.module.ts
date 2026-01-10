import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItemModule } from '../order-item/order-item.module';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    OrderItemModule,
    CartsModule,


  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
