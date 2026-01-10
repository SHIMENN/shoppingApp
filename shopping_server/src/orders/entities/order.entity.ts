import { Entity,PrimaryGeneratedColumn,Column,ManyToOne,OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    orderId: number;

    @Column()
    orderDate: Date;

    @Column()
    totalAmount: number;

    @Column()
    status: string;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];

}

