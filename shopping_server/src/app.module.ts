import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemModule } from './order-item/order-item.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { Cart } from './carts/entities/cart.entity';
import { CartItem } from './cart-item/entities/cart-item.entity';
import { OrderItem } from './order-item/entities/order-item.entity';
import { CloudinaryModule } from './products/cloudinary/cloudinary.module';  
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Product, Order, Cart, CartItem, OrderItem],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        
      }),
    }),

     UsersModule,
      ProductsModule, 
      CartsModule, 
      OrdersModule, 
      OrderItemModule,
       CartItemModule, 
       AuthModule, 
       CloudinaryModule],

       
  controllers: [AppController],
  providers: [
    AppService,{
      provide:APP_GUARD,
      useClass:ThrottlerGuard
    }
    ],
})
export class AppModule {}
