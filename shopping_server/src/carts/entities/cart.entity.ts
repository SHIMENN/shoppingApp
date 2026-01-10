import { Entity, PrimaryGeneratedColumn,OneToOne, JoinColumn,CreateDateColumn,OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';

@Entity('carts')   
export class Cart {
    @PrimaryGeneratedColumn()
    cartId: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => User, user => user.cart)
    @JoinColumn()
    user: User;

    @OneToMany(() => CartItem, cartItem => cartItem.cart)
    cartItems: CartItem[];
}
