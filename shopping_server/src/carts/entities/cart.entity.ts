import { Entity, PrimaryGeneratedColumn,OneToOne, JoinColumn,CreateDateColumn,OneToMany, Column } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';

@Entity('carts')   
export class Cart {
    @PrimaryGeneratedColumn()
    cartId: number;

    @CreateDateColumn()
    createdAt: Date;

    // עמודה מספרית פשוטה - בלי insert: false!
    @Column({ nullable: true })
    userUserId: number;

    // הקשר משתמש בדיוק באותה עמודה (userId)
    @OneToOne(() => User, user => user.cart)
    @JoinColumn({ name: 'userUserId' }) 
    user: User;

    @OneToMany(() => CartItem, cartItem => cartItem.cart)
    cartItems: CartItem[];
}
