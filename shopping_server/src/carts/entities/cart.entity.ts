import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CartItem } from '../../cart-item/entities/cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  cart_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ name: 'user_user_id', nullable: true })
  user_user_id: number;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_user_id' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  cartItems: CartItem[];
}
