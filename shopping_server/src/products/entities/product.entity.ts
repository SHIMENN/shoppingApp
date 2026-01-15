import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { Entity,PrimaryGeneratedColumn,Column,OneToMany} from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    productId: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('int')
    stock: number;

    @Column()
    imageUrl: string;

    @OneToMany(() => CartItem, cartItem => cartItem.product)
    cartItems: CartItem[];

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItems: OrderItem[];

}
