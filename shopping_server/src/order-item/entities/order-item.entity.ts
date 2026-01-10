import { Entity,PrimaryGeneratedColumn,Column,ManyToOne } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('orderitems')
export class OrderItem {
    @PrimaryGeneratedColumn()
    orderItemId: number;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;


    @ManyToOne(() => Order, order => order.orderItems)
    order: Order;

    @ManyToOne(() => Product, product => product.orderItems)
    product: Product;
}