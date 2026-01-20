import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from '../../carts/entities/cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  cart_item_id: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'cart_cart_id' })
  cart_cart_id: number;

  @Column({ name: 'product_id' })
  product_id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
